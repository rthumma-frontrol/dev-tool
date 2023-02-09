// var apiConstant = require('./apiConstant');
var metaData = (function () {
    "use strict";
    var m_documentTypesList;
    var m_documentType;
    var API_URL = 'https://dashboard.frontrol.com/api/';
    var arrayEventHandler = ['documentName'];
    var jsonMetaData = ["_DBMETADATA", "_JOIMETADATA", "_QUERY", "_AUTHORIZATION", "_CUSTOMIZATION"];
    var testingJsonMetadata = ["_TESTDATA_CREATE"];
    var tabJsonMetaId = ["dbmetadata", "joimetadata", "querymetadata", "authmetadata", "customization"];
    var jsMetaData = ["_samplePreExtension", "_samplePostExtension"];
    var tabJsMetaId = ["saveextension", "queryextension"];
    var gitUserName = "";
    var gitToken = "";
    var repoName = "";
    var branch = "";
    var msgBoxFlag = false;

    var path = "platform/tenant_1";
    var metaDatatoken = "";
    //var metaDatatoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3LmZyb250cm9sLmNvbS8iLCJ1c2VyTmFtZSI6ImpveTk5IiwidGVuYW50SWQiOjEsIm5hbWVJREZvcm1hdCI6IiIsImlhdCI6MTY1OTAzNTU3MywiZXhwIjoxNjU5MDM5MTczfQ.zxwis2vH2LUYGJ1gIYn69dt8U2wgZatdnJ3_4ZgL6Oc";

    var createDocument = JSON.stringify({
        "level1": {
            "entityName": "Project6",
            "tableName": "TEST_PROJECTS"
        },
        "level2": [
            {
                "entityName": "Task1",
                "tableName": "TEST_PROJECTS_TASKS"
            },
            {
                "entityName": "KeyMember",
                "tableName": "TEST_PROJECTS_USERS"
            }
        ]
    }, null, 2)
    var pageCrudFlag = "R";
    function initMetaData() {
        $('#login-form').hide();

        addListener(arrayEventHandler, 'change', handleChangeEvent);

        if (!metaDatatoken && metaDatatoken == "") {
            login_form();
        }
        else {
            setConfig();
            queryDocuments();
        }

    }

    function login_form() {

        $("#login-form").dialog({
            title: "Enter Login Info",
            modal: true,
            buttons: {
                'OK': function () {
                    var userName = $('input[name="userName"]').val();
                    var password = $('input[name="password"]').val();

                    if (userName.length > 0 && password.length > 0) {
                        login(userName, password, function (token) {
                            if (token && token.Status === "SUCCESS") {
                                console.log('token', token);
                                metaDatatoken = token.Message[0].token;

                                setConfig();
                                queryDocuments();
                            }
                            else {
                                window.location.reload();
                            }

                        });
                        $(this).dialog('close');

                    }
                }

            }
        });
    }
    function login(userName, password, callback) {
        if (userName && password) {
            fetch(`https://dashboard.frontrol.com/api/users/login`, {
                method: 'post',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: `username=${userName}&userpassword=${password}`

            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if (callback) callback.call(this, data);
                })
                .catch(function (error) {
                    throw error;
                });
        }
    }

    function setConfig() {
        // gitUserName = "bosej2000";
        // gitToken = "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";
        // repoName = "nodejs";
        // branch = "development1";
        var data = localStorage.getItem("configData");
        if (data) {
            $("textarea#configData").val(data);

            data = JSON.parse(data);
            gitUserName = data.gitUserName;
            gitToken = data.gitToken;
            repoName = data.repoName;
            branch = data.branch;
        }
        else {
            gitUserName = "bosej2000";
            gitToken = "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";
            repoName = "nodejs";
            branch = "development1";
            data = JSON.stringify({
                'Metadata': 'platform/metadata/tenant_1',
                'Extension': 'standard/tenant_1',
                'Server': 'http://localhost:4000/',
                "gitUserName": gitUserName,
                "gitToken": gitToken,
                "repoName": repoName,
                "branch": branch
            }, null, 2);
            localStorage.setItem("configData", data);
            $("textarea#configData").val(data);
        }
        $("textarea#newDocumentValue").val(createDocument);
    }
    function createConfig() {
        var data = $("textarea#configData").val();
        if (data) {

            data = JSON.parse(data);

            gitUserName = data.gitUserName;
            gitToken = data.gitToken;
            repoName = data.repoName;
            branch = data.branch;

            data = JSON.stringify(data, null, 2);
            localStorage.setItem("configData", data);
            $("textarea#configData").val(data);
        }

    }
    function queryDocuments(documentTypeId, file, callback) {
        queryData(API_URL + 'ui/getblobfile', "docList_joy99.json", function (data) {

            if (data) {
                m_documentTypesList = JSON.stringify(data);
                if (!documentTypeId || pageCrudFlag === "C") {
                    $("#mySelect option:not(:first)").remove();
                    PopulateDropDownList(JSON.parse(data), 'documentName', 'documentTypeId', 'documentType', '', '', true);
                    if (pageCrudFlag === "C") {
                        $('select[id="documentName"]').find('option:contains("' + documentTypeId + '")').attr("selected", true);
                    }

                    var element = document.getElementById('documentName');
                    var event = new Event('change');
                    element.dispatchEvent(event);
                    pageCrudFlag = "R";
                    document.getElementById("loader").style.display = "none";
                }
            }
            if (callback) callback.call(this);
        });
    }


    function queryData(url, file, callback, id, formate) {
        // var data = "[\"Project2\",\"Project1\",\"TestProjects\"]";       
        fetch(url, {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "bearer " + metaDatatoken
            },
            body: JSON.stringify({ "fileName": file })
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                if (id) {
                    if (formate === "json") {
                        data = JSON.stringify(JSON.parse(data), null, 2);
                    }
                    $("textarea#" + id).val(data);
                }
                console.log(data);
                if (callback) callback.call(this, data);

            })
            .catch(function (error) {
                throw error;
            });
    }

    function PopulateDropDownList(data, elementID, idCol, nameCol, filterValue, filterCol, clearDD) {

        var ddData = document.getElementById(elementID);

        //below filter is to filter the data for a value passed in filterValue
        if (filterValue !== '') {

            data = data.filter(function (modifiedData) {
                return modifiedData.schType == filterValue;
            });
        }

        //this is use if we want to clear the dropdown before populating it again
        if (clearDD == true) {
            var ddCount = ddData.options.length;
            while (ddCount--) {
                if (ddData[ddCount].value !== '') {

                    ddData.remove(ddCount);
                }
            }
        }

        //AlreadyExist is used to remove the duplicate record if any in the queried metadata data
        var alreadyExist = {};
        for (var i = 0; i < data.length; i++) {

            //if (! alreadyExist[data[i][nameCol]]) {
            var option = document.createElement('OPTION');
            option.innerHTML = data[i];
            option.value = data[i];
            // option.innerHTML = data[i][nameCol];
            // option.value = data[i][idCol];
            ddData.options.add(option);
            //alreadyExist[data[i][nameCol]] = true;
            alreadyExist[data[i]] = true;
            //}

        }
    }

    function addListener(params, eventName, functionName) {
        for (var i = 0; i < params.length; i++) {
            //document.getElementById(id).addEventListener(eventName, functionName);
            document.getElementById(params[i]).addEventListener(eventName, functionName);
        }

    }

    async function handleChangeEvent(e) {

        if (e.target.id == 'documentName') {
            if (e.target.value !== '') {
                var projectElement = document.getElementById("documentName");
                var selectedText = projectElement.options[projectElement.selectedIndex].text;
                m_documentType = selectedText;

                for (var i = 0; i < jsonMetaData.length; i++) {
                    await queryData(API_URL + 'ui/getblobfile', selectedText + jsonMetaData[i] + '.json', function (data) {
                    }, tabJsonMetaId[i], "json");
                }
                await queryData(API_URL + 'ui/getblobfile', selectedText + testingJsonMetadata[0] + '.json', function (data) {
                }, "testingmetadata", "json");

                for (var j = 0; j < jsMetaData.length; j++) {
                    await queryData(API_URL + 'ui/getblobfile', selectedText + jsMetaData[j] + ".js", function (data) {
                    }, tabJsMetaId[j]);

                }




            }
        }
    }

    async function save() {
        document.getElementById("loader").style.display = "block";
        if (!m_documentType) {
            showToast("Please select any Document Name");
            return;
        }
        var msgBox = true;
        for (var i = 0; i < jsonMetaData.length; i++) {
            console.log("json", $('#' + jsonMetaData[i]).val());
            await saveData(m_documentType + jsonMetaData[i] + '.json', $('#' + tabJsonMetaId[i]).val());

        }
        for (var j = 0; j < jsMetaData.length; j++) {
            console.log("js", $('#' + jsMetaData[j]).val());
            await saveData(m_documentType + jsMetaData[j] + ".js", $('#' + tabJsMetaId[j]).val());
        }

        if (msgBoxFlag) {
            showToast("All file successfully uploaded");
            msgBoxFlag = false;
        }
        document.getElementById("loader").style.display = "none";

    }



    function saveData(MetaDataKey, data) {

        return fetch(`${API_URL}/ui/saveblobfile`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', "Authorization": "bearer " + metaDatatoken },
            body: JSON.stringify({ 'fileName': MetaDataKey, 'content': data })
        })
            .then(function (response) {
                return response.json();
                //return "Document published successfully";;
            })
            .then(function (data) {
                console.log(data);
                if (data.Status === "SUCCESS") {

                    msgBoxFlag = true;


                }

            })
            .catch(function (error) {
                throw error;
            });
    }

    function generateDocument() {
        document.getElementById("loader").style.display = "block";
        //showToast("createDocument");
        //var documentName = document.getElementById("newDocumentName").value;
        var newDocumentValue = document.getElementById("newDocumentValue").value;

        //newDocumentValue = JSON.stringify({ newDocumentValue });
        var data = JSON.parse(newDocumentValue);
        var newDocumentName = data.level1['entityName']
        data.level1 = JSON.stringify(data.level1);
        data.level2 = JSON.stringify(data.level2);

        //console.log(newDocumentName, JSON.stringify(data));
        return fetch(`${API_URL}ui/generatemetadata`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', "Authorization": "bearer " + metaDatatoken },
            body: JSON.stringify(data),
        })
            .then(function (response) {
                return response.json();
                //return "Document published successfully";;
            })
            .then(function (data) {
                console.log(data, newDocumentName);
                if (data.Status === "SUCCESS") {
                    pageCrudFlag = "C";
                    queryDocuments(newDocumentName);
                    showToast(data.Message);
                }
                document.getElementById("loader").style.display = "none";
            })
            .catch(function (error) {
                document.getElementById("loader").style.display = "none";
                throw error;
            });

    }

    function publish() {

        if (!m_documentType) {
            showToast("Please select any Document Name");
            return;
        }
        document.getElementById("loader").style.display = "block";
        return fetch(`${API_URL}/ui/publishdocument`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', "Authorization": "bearer " + metaDatatoken },
            body: JSON.stringify({ "documentName": m_documentType })

        })
            .then(function (response) {
                return response.json();
                //return "Document published successfully";;
            })
            .then(function (data) {
                console.log(data);
                if (data.Status === "SUCCESS") {
                    showToast(data.Message);
                }
                document.getElementById("loader").style.display = "none";
            })
            .catch(function (error) {
                document.getElementById("loader").style.display = "none";
                throw error;

            });

        document.getElementById("loader").style.display = "none";

    }

    function checkin() {

        if (!m_documentType) {
            showToast("Please select any Document Name");
            return;
        }
        document.getElementById("loader").style.display = "block";
        return fetch(`${API_URL}/ui/checkintogit`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', "Authorization": "bearer " + metaDatatoken },
            body: JSON.stringify({
                "gitUserName": gitUserName,
                "gitToken": gitToken,
                "repoName": repoName,
                "documentName": m_documentType,
                "branch": branch
            })
        })
            .then(function (response) {
                return response.json();
                //return "Document published successfully";;
            })
            .then(function (data) {
                console.log(data);
                if (data.Status === "SUCCESS") {
                    showToast(data.Message);
                }
                document.getElementById("loader").style.display = "none";

            })
            .catch(function (error) {
                document.getElementById("loader").style.display = "none";
                throw error;
            });

    }
    function checkout() {
        if (!m_documentType) {
            showToast("Please select any Document Name");
            return;
        }
        document.getElementById("loader").style.display = "block";
        return fetch(`${API_URL}/ui/checkoutfromgit`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', "Authorization": "bearer " + metaDatatoken },
            body: JSON.stringify({
                "gitUserName": gitUserName,
                "gitToken": gitToken,
                "repoName": repoName,
                "documentName": m_documentType,
                "branch": branch
            })
        })
            .then(function (response) {
                return response.json();
                //return "Document published successfully";;
            })
            .then(function (data) {
                console.log(data);
                if (data.Status === "SUCCESS") {
                    showToast(data.Message);
                }
                document.getElementById("loader").style.display = "none";

            })
            .catch(function (error) {
                document.getElementById("loader").style.display = "none";
                throw error;
            });
    }
    function showToast(s, params, interval) {

        //$(document).on("click", "#btn", function () {


        // $("#messagebox").html("hello").dialog();
        // $("#messagebox").dialog('open');

        $('#messagebox').dialog({
            modal: true,
            title: "Message",
            open: function () {
                var markup = s;
                $("#messagebox").html(markup);
            },
            buttons: {
                Ok: function () {
                    $("#messagebox").dialog("close");
                }
            }
        }); //end confirm dialog
        //$("#messagebox").dialog("close");
        //$("#messagebox").dialog('open');

        // $('<div></div>').dialog({
        //     modal: true,
        //     title: "Message",
        //     open: function () {
        //         var markup = s;
        //         $(this).html(markup);
        //     },
        //     buttons: {
        //         Ok: function () {
        //             $(this).dialog("close");
        //         }
        //     }
        // }); //end confirm dialog

        //});


        // if (!interval) interval = 4000;
        // $("#messageBox").text(s);
        // $("#messageBox").dialog("option", "buttons", null);
        // $("#messageBox").dialog("option", "modal", false);
        // $("#messageBox").dialog("option", "hide", "fade");
        // setTimeout(function () {
        //     $("#messageBox").dialog("close");
        // }, interval);

        // $("#messageBox").dialog("open");
    }
    return {
        initMetaData: initMetaData,
        save: save,
        generateDocument: generateDocument,
        publish: publish,
        checkin: checkin,
        checkout: checkout,
        createConfig: createConfig

    }

})();
