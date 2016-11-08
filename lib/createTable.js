// * Copyright 2016, Kuldeep Kumar
var CreateTable = (function () {



    /**
     * _privateProcessors object stores all the private function.
     * these function are used internally and called to develop the datatable.
     * intance parameter is passed to most of the function to perform operation
     * on basis of current object
     */
    var _privateProcessors = {

        // Calculate the no of pages.
        calculateNoOfPages: function (instance) {
            return (Math.ceil(instance._privateStore._tabData.length / instance._privateStore._pageSize));
        },


        /**
         *draw the direct children of the parent components including
         * favourite comp divs, table and pagination boxes.
         */
        drawComponents: function (instance) {
            this.removeElemChildren(document.getElementById(instance._privateStore._parentComp));
            var table = document.createElement('table');
            table.className = "table table-bordered";
            var div3 = document.createElement('DIV');
            div3.className = 'pagination pull-right';
            var p = document.createElement('p');
            var ul = document.createElement('ul');
            ul.className = 'pagination pagination-sm';
            div3.appendChild(p);
            div3.appendChild(ul);
            document.getElementById(instance._privateStore._parentComp).appendChild(table);
            document.getElementById(instance._privateStore._parentComp).appendChild(div3);
        },




        /**
         *draw table header dynamically
         * get the data from store and generate dynamic dropdown for column headers
         */
        drawTableHeader: function (instance) {
            var tbl = document.getElementById(instance._privateStore._parentComp).children[0];
            var tblHead = tbl.createTHead();
            var row = tblHead.insertRow(0);
            for (var i = 0; i < instance._privateStore._noOfColumns; i++) {
                var cell = document.createElement("TH");
                row.appendChild(cell);


                //for the first header having serach text box
                if (i == 0) {
                    var div = document.createElement('DIV');
                    var label = document.createElement('label');
                    label.innerHTML = instance._privateStore._firstColumn;
                    var input = document.createElement("INPUT");
                    input.setAttribute("type", "text");
                    input.setAttribute("placeholder", "Search");
                    input.setAttribute("name", "keywords");
                    input.setAttribute("value", "");
                    input.setAttribute("data-function", "searchQuery");
                    input.className = 'table-header-controls form-control';
                    div.appendChild(label);
                    div.appendChild(input);
                    cell.setAttribute("data-value", instance._privateStore._firstColumn);
                    cell.appendChild(div);
                }

                // for the remaining containing dropdowns and sorting arrows
                else {
                    var selectList = document.createElement("select");
                    cell.appendChild(selectList);
                    for (var propname in instance._privateStore._tabData[0]) {
                        if (propname !== instance._privateStore._firstColumn) {
                            var option = document.createElement("option");
                            option.value = propname;
                            option.text = propname;
                            selectList.appendChild(option);
                        }
                    }
                    selectList.className = 'table-header-controls form-control';
                    selectList.setAttribute('data-function', "colomnValue");
                    selectList.selectedIndex = i - 1;
                    var acomp = document.createElement('a');
                    acomp.setAttribute('href', '#');
                    acomp.setAttribute('data-function', 'sortArrow');
                    acomp.setAttribute('value', 'asc');
                    acomp.className = 'glyphicon glyphicon-arrow-up';
                    cell.appendChild(acomp);
                    acomp = document.createElement('a');
                    acomp.setAttribute('href', '#');
                    acomp.setAttribute('data-function', 'sortArrow');
                    acomp.setAttribute('value', 'desc');
                    acomp.className = 'glyphicon glyphicon-arrow-down';
                    cell.setAttribute("data-value", selectList.options[selectList.selectedIndex].value);
                    cell.appendChild(acomp);
                }
            }
        },



        // draw rows of table

        drawTableRows: function (instance) {
            var tbl = document.getElementById(instance._privateStore._parentComp).children[0];
            while (tbl.rows.length > 1) {
                tbl.deleteRow(1);
            }
            var tbody = document.createElement('tbody');
            try {
                //removing old tbody tag from table
                var old_tbody = tbl.tBodies[0];
                tbl.replaceChild(tbody, old_tbody);
            } catch (err) {}
            // loop running for each record for the current page
            for (var i = instance._privateStore._startLimit; i < instance._privateStore._endLimit; i++) {
                var row = document.createElement("TR");
                var tHeadChildren = tbl.tHead.children[0].children
                for (var j = 0; j < instance._privateStore._noOfColumns; j++) {
                    var value = tHeadChildren[j].getAttribute('data-value')
                    var col = document.createElement("TD");
                    col.appendChild(document.createTextNode(instance._privateStore._tabData[i][value]));
                    row.appendChild(col);

                }
                tbody.appendChild(row); // row added to table body and loop continues
            }
            tbl.appendChild(tbody);
        },


        // draw page represting boxes
        drawPageAnchorPagination: function (instance) {
            var ulcomp = document.getElementById(instance._privateStore._parentComp).children[1].children[1];
            this.removeElemChildren(ulcomp);
            for (var i = 1; i <= instance._privateStore._noOfPages; i++) {
                var licomp = document.createElement('li');
                var acomp = document.createElement('a');
                acomp.setAttribute('data-function', 'pageAnchorPagination')
                acomp.setAttribute('href', '#');

                acomp.appendChild(document.createTextNode(i));
                licomp.appendChild(acomp);
                ulcomp.appendChild(licomp);
            }
        },


        //draw labels reperesting selected no of records
        drawPageLabelPagination: function (instance) {
            var pcomp = document.getElementById(instance._privateStore._parentComp).children[1].children[0];
            pcomp.innerHTML = (instance._privateStore._startLimit + 1) + " - " + (instance._privateStore._endLimit) + " / " + instance._privateStore._noOfRecords;
        },


        // this activates and highlight the selected page no
        activePageAnchorPagination: function (instance) {
            var licomps = document.getElementById(instance._privateStore._parentComp).children[1].children[1].children;
            for (var i = 0; i < licomps.length; i++) {
                licomps[i].className = "";
                licomps[instance._privateStore._selectedPageNo - 1].className = "active";
            }
        },

        // function to remove children of an element
        removeElemChildren: function (elem) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        },



        // event handlers


        // when page is changed
        paginationPageChange: function (instance, pageno) {
            instance._privateStore._selectedPageNo = pageno;
            //startlimit and endlimit index per page is calculated.
            instance._privateStore._startLimit = ((instance._privateStore._selectedPageNo - 1) * instance._privateStore._pageSize);
            if (instance._privateStore._startLimit + (instance._privateStore._pageSize) <= (instance._privateStore._noOfRecords)) {
                instance._privateStore._endLimit = instance._privateStore._startLimit + (instance._privateStore._pageSize);
            } else {
                instance._privateStore._endLimit = instance._privateStore._noOfRecords;
            }
            this.activePageAnchorPagination(instance); // activated the selected page no/
            this.drawPageLabelPagination(instance); // draw page labels for the selected page
            this.drawTableRows(instance); // draw rows of table
        },



        // function used internally to calculate the index of value present in table data.
        findIndexOfVal: function (instance, value) {

            for (var i = 0; i < instance._privateStore._tabData.length; i++) {
                if (instance._privateStore._tabData[i].country.value == value) {
                    return i;
                }
            }
        },

        // sort array of objects on basis of sorttype
        sortArrayOfObjects: function (instance, sortType, sortString) {

            //if ascending sorting is required.
            if (sortType == "asc") {
                var obj = instance._privateStore._tabData.sort(function (a, b) {
                    //  return parseFloat(a[sortString].value) - parseFloat(b[sortString].value);
                    if (a[sortString] < b[sortString])
                        return -1;
                    if (a[sortString] > b[sortString])
                        return 1;
                    return 0;
                });
            }
            // if descending sorting is required
            else {
                var obj = instance._privateStore._tabData.sort(function (a, b) {
                    //  return parseFloat(b[sortString].value) - parseFloat(a[sortString].value);
                    if (a[sortString] > b[sortString])
                        return -1;
                    if (a[sortString] < b[sortString])
                        return 1;
                    return 0;
                });
            }
        },




        // called to initialize _privateStore data members
        initializePrivateStore: function (instance) {
            instance._privateStore._noOfRecords = instance._privateStore._tabData.length;
            instance._privateStore._noOfPages = this.calculateNoOfPages(instance);
            instance._privateStore._selectedPageNo = 1;
        },



        // returns the records with the matching searchString
        getSearchResults: function (instance, searchString) {
            var searchResults = [];
            for (var i = 0; i < instance._privateStore._basetabData.length; i++) {
                if (instance._privateStore._basetabData[i][instance._privateStore._firstColumn].trim().toLowerCase().indexOf(searchString.trim().toLowerCase()) >= 0 || searchString == "") {
                    searchResults.push(instance._privateStore._basetabData[i]);
                }
            }
            return searchResults;
        },


        //Called when to perform search on kep up event
        performSearchQuery: function (instance, searchString) {
            instance._privateStore._tabData = this.getSearchResults(instance, searchString); //getting serached result
            this.initializePrivateStore(instance); //initialize the data memebers accordingly.
            this.drawPageAnchorPagination(instance); // draw page anchors due to diiferent no pages
            this.paginationPageChange(instance, instance._privateStore._selectedPageNo); // called when page is changed
        },



        //called to perform sorting on table
        performSorting: function (instance, sortType, sortString) {
            this.sortArrayOfObjects(instance, sortType, sortString); //get the sorted result on basis of respective selected value.
            this.drawTableRows(instance); // table rows are drawn with the sorted data.
        },
    }


    /**
     * Constructor function for API object returned
     * @parentComp id of parent component in which dataTable to be displayed
     * @tabData Data of table to be displayed
     * @pageSize size of page [Currently works well with pagesize=5]
     */

    function CreateTable(parentComp, tabData, pageSize, firstColumn) {
        var self = this;
        self._privateStore = {
            _tabData: tabData, // data variable that is actually changed when searched and sorted and rendered to table
            _basetabData: tabData, // data variable that is base table and will remain unchanged.
            _parentComp: parentComp, // parent Component id of table wrapper
            _pageSize: pageSize, // pageSize of table.
            _noOfPages: 1, // No of pages default=1 calculated on basis of pagesize and no of records in data
            _noOfRecords: 1, // No of records in data
            _selectedPageNo: 1, // Stores currently selected page no
            _startLimit: 0, // Stores starting index value of per page
            _endLimit: tabData.length >= 5 ? 5 : tabData.length, // Stored ending index value of per page
            _noOfColumns: Object.keys(tabData[0]).length, //no of columns to display
            _firstColumn: firstColumn //first column name
        };


        // binding different events with respective handler

        document.getElementById(self._privateStore._parentComp).addEventListener("click", function (event) {
            var datafunction = event.target.getAttribute('data-function'); // getting value of data-function attribute of event source
            switch (datafunction) {
                case "pageAnchorPagination": // event fired when page is clicked.
                    _privateProcessors.paginationPageChange(self, parseInt(event.target.text));
                    break;
                case "sortArrow": // event fired when sorting arrow is clicked
                    var sel = event.target.parentNode.children[0];
                    _privateProcessors.performSorting(self, event.target.getAttribute('value'), sel.options[sel.selectedIndex].text);
                    break;
            }
        });


        document.getElementById(self._privateStore._parentComp).addEventListener("change", function (event) {
            var datafunction = event.target.getAttribute('data-function');
            switch (datafunction) {
                case "colomnValue": //event fired when column value is changed in column
                    event.target.parentNode.setAttribute('data-value', event.target.value)
                    _privateProcessors.drawTableRows(self);
                    break;
            }
        });

        document.getElementById(self._privateStore._parentComp).addEventListener("keyup", function (event) {
            var datafunction = event.target.getAttribute('data-function');
            switch (datafunction) {
                case "searchQuery": // event fired when search-text box is entered with text.
                    _privateProcessors.performSearchQuery(self, event.target.value);
                    break;
            }
        });




        /**
         *API function are kept private to access outside.
         *Internally these functions are stored in _privateProcessors and called privately internally
         */
        _privateProcessors.initializePrivateStore(self); // initialize required data members for API object
        _privateProcessors.drawComponents(self); // Draw componets of parent div including table , favourite container
        _privateProcessors.drawTableHeader(self); // Draw table headers dynamically.
        _privateProcessors.drawTableRows(self); // draw table rows
        _privateProcessors.drawPageLabelPagination(self); // draw label showing currently selected no of records
        _privateProcessors.drawPageAnchorPagination(self); // draw pages showing boxes.
        _privateProcessors.activePageAnchorPagination(self); // activate the currently selected page no.
        //
    };




    // method accessible to API

    // to get the selected Page no.
    CreateTable.prototype.getSelectedPageNo = function () {
        return this._privateStore._selectedPageNo;
    };


    // to get the no of records present in table.
    CreateTable.prototype.getNoOfRecords = function () {
        return this._privateStore._noOfRecords;
    };

    return CreateTable;
}());
