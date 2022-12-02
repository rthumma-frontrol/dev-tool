var generateJson = (function () {
    "use strict";

    function initGenerateData(length) {
        var data = getData(length);
        //console.log("data", data);
        document.write(JSON.stringify(data));
        saveAs(new Blob([JSON.stringify(data)], { type: 'text/JSON', endings: 'native' }), 'config.json');

    }

    function getData(length) {
        let data = [];
        let projects = [];
        for (let i = 0; i < length; i++) {
            const projectId = 10000 + i + 1;
            const projectnumber = 600000 + i + 1;
            const projectName = "Project600000" + (i + 1);
            const projectStatus = "Approved";
            const lastUpdateDate = "6/25/2022";
            const lastSummDate = "6/25/2022 9:00:00 AM";
            const billedAR60Days = generateDays(13, 100000, 999999);
            const billedAR60Days90 = generateDays(13, 100000, 999999);
            const billedAR90Days180 = generateDays(13, 100000, 999999);
            const billedARDays180 = generateDays(13, 100000, 999999);
            const retentionAdjustment = [4136225, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4136225];
            const billedARDaysActuals = generateDays(13, 5, 30);

            projects.push({
                projectId: projectId,
                projectnumber: projectnumber,
                projectName: projectName,
                projectStatus: projectStatus,
                lastUpdateDate: lastUpdateDate,
                lastSummDate: lastSummDate,
                billedAR60Days: billedAR60Days,
                billedAR60Days90: billedAR60Days90,
                billedAR90Days180: billedAR90Days180,
                billedARDays180: billedARDays180,
                retentionAdjustment: retentionAdjustment,
                billedARDaysActuals: billedARDaysActuals,

            });
        }
        //data.push({ "projects": projects });
        return projects;
    }

    function generateDays(length, minimum, maximum) {
        let data = [];
        for (let i = 0; i < length; i++) {
            data.push(
                Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
            )
        }
        return data;
    }

    return {
        initGenerateData: initGenerateData,

    }

})();