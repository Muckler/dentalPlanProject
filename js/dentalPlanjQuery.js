(function () {
    var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
    Boolean.parse = function(val) { 
     return !falsy.test(val) && !!val;
    };
    var userInput = { married: Boolean.parse(localStorage.getItem("marriedYN")), kids: Boolean.parse(localStorage.getItem("kidsYN")), ortho: Boolean.parse(localStorage.getItem("orthoYN")) };
    console.log(userInput);
    //api url from https://dev.socrata.com/foundry/data.healthcare.gov/dtk6-f38y
    var url = "https://data.healthcare.gov/resource/dtk6-f38y.json";
    // API for Maryland schoolchildren data (Kindergarten  & 3rd grade)
   
    var theData = {};

    //global variable because several functions use it
    $.get(url).done(function (response) {
        updateUISuccess(response);
    }).fail(function (error) {
        console.log(error);
    })

       
    //below function for non married users
    function Individual(userInput, uniqueS) {
        var chartOutS = [];
        if (userInput.kids == true) {
            //user selected ortho coverage for kids
            if (userInput.ortho == true) {
                var graphS = [];
                for (let i = 0; i < 4; i++) {
                    let chartOutS = {};
                    chartOutS.planName = uniqueS[i].issuer_name;
                    chartOutS.phone = uniqueS[i].customer_service_phone_number_toll_free;
                    chartOutS.cost = Number(uniqueS[i].individual_1_child_age_21);
                    chartOutS.ortho = uniqueS[i].orthodontia_child;
                    chartOutS.major = uniqueS[i].major_dental_care_adult;
                    //adding elements of chartOutSKO to return graphMKO to graph
                    graphS.push(chartOutS);
                }//end for loop
                var uniqueMNum = [];
                //convert string values to number couple_1_child_age_21
                uniqueS.forEach(function (element) {
                    uniqueMNum.push(Number(element.individual_1_child_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo);
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphS);
                var dentalBox = document.getElementsByClassName('plan1');
                for (let m = 0; m < 4; m++) {
                    var dentalElem = document.createElement('p');
                    dentalElem.innerHTML = "Plan Name:  " + graphS[m].planName + "<br />" + "Plan Phone #:  " + graphS[m].phone +
                        "<br />" + "Cost of Dental Plan:  $" + graphS[m].cost +
                        "<br />" + "Ortho Coverage for Kids:  " + graphS[m].ortho
                        + "<br />" + "Major Coverage:  " + graphS[m].major;
                    dentalBox[0].append(dentalElem);
                }//end for loop
                var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["My Plan", "Average Plan"],
                        datasets: [{
                            label: 'Plan Cost in Dollars',
                            data: [graphS[0].cost, avgC],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                ;

            }//end ortho if
            // else for no ortho and have kids
            else  {
                var graphS = [];
                for (let i = 0; i < 4; i++) {
                    let chartOutS = {};
                    chartOutS.planName = uniqueS[i].issuer_name;
                    chartOutS.phone = uniqueS[i].customer_service_phone_number_toll_free;
                    chartOutS.cost = Number(uniqueS[i].premium_adult_individual_age_21);
                    chartOutS.major = uniqueS[i].major_dental_care_adult;
                    //adding elements of chartOutSKO to return graphMKO to graph
                    graphS.push(chartOutS);
                }//end for loop
                var uniqueSNum = [];
                //convert string values to number couple_1_child_age_21
                uniqueS.forEach(function (element) {
                    uniqueSNum.push(Number(element.individual_1_child_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueSNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo);
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphS);
                var dentalBox = document.getElementsByClassName('plan1');
                for (let m = 0; m < 4; m++) {
                    var dentalElem = document.createElement('p');
                    dentalElem.innerHTML = "Plan Name:  " + graphS[m].planName + "<br />" + "Plan Phone #:  " + graphS[m].phone +
                        "<br />" + "Cost of Dental Plan:  $" + graphS[m].cost 
                        + "<br />" + "Major Coverage:  " + graphS[m].major;
                    dentalBox[0].append(dentalElem);
                }//end for loop
                var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["My Plan", "Average Plan"],
                        datasets: [{
                            label: 'Plan Cost in Dollars',
                            data: [graphS[0].cost, avgC],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                ;
            }
        }//end kids if 
        //no kids below else do not need ortho logic cause no ortho
        else {
            var graphS = [];
            for (let i = 0; i < 4; i++) {
                let chartOutS = {};
                chartOutS.planName = uniqueS[i].issuer_name;
                chartOutS.phone = uniqueS[i].customer_service_phone_number_toll_free;
                //cost for individual no kids
                chartOutS.cost = Number(uniqueS[i].premium_adult_individual_age_21);
                chartOutS.major = uniqueS[i].major_dental_care_adult;
                //adding the four least expensive to graphS
                graphS.push(chartOutS);
            }//end for 
            var uniqueMNum = [];
            //convert string values to number couple_1_child_age_21
            uniqueS.forEach(function (element) {
                uniqueMNum.push(Number(element.premium_adult_individual_age_21));
            });
            //remove NaN values from uniqueMNum
            var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
            console.log("filtered code");
            console.log(uniqueNaNgo);
            //max cost of plan
            var maxC = Math.max.apply(null, uniqueNaNgo);
            // min cost of plan
            var minC = Math.min.apply(null, uniqueNaNgo);
            var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
            //toFixed limits to 2 decimal places the avg cost
            var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
            console.log(maxC, minC, avgC);
            console.log(graphS);
            var dentalBox = document.getElementsByClassName('plan1');
            for (let m = 0; m < 4; m++) {
                var dentalElem = document.createElement('p');
                dentalElem.innerHTML = "Plan Name:  " + graphS[m].planName + "<br />" + "Plan Phone #:  " + graphS[m].phone +
                    "<br />" + "Cost of Dental Plan:  $" + graphS[m].cost +
                    "<br />" + "Major Coverage:  " + graphS[m].major;
                dentalBox[0].append(dentalElem);
            }//end for loop
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["My Plan", "Average Plan"],
                    datasets: [{
                        label: 'Plan Cost in Dollars',
                        data: [graphS[0].cost, avgC],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',

                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            ;    
        }//end else no kids
        //return graphS;
    }//end individual function
    function Married(userInput, uniqueM) {
        console.log(uniqueM);
        var graphM = [];
        // code here if kids and another if else for ortho
        if (userInput.kids == true) {
            //user selected ortho coverage for kids
            if (userInput.ortho == true) {
                //var graphMKO = [];    
                //need to remove duplicate plans in data
                for (let i = 0; i < 4; i++) {
                    let chartOutM = {};
                    chartOutM.planName = uniqueM[i].issuer_name;
                    chartOutM.phone = uniqueM[i].customer_service_phone_number_toll_free;
                    chartOutM.cost = Number(uniqueM[i].couple_1_child_age_21);
                    chartOutM.ortho = uniqueM[i].orthodontia_child;
                    chartOutM.major = uniqueM[i].major_dental_care_adult;
                    graphM.push(chartOutM);
                }//end for loop

                //starting code for max min avg
                var uniqueMNum = [];
                //convert string values to number couple_1_child_age_21
                uniqueM.forEach(function (element) {
                    uniqueMNum.push(Number(element.couple_1_child_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo);
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphM);
                var dentalBox = document.getElementsByClassName('plan1');
                for (let m = 0; m < 4; m++) {
                    var dentalElem = document.createElement('p');
                    dentalElem.innerHTML = "Plan Name:  " + graphM[m].planName + "<br />" + "Plan Phone #:  " + graphM[m].phone +
                        "<br />" + "Cost of Dental Plan:  $" + graphM[m].cost +
                        "<br />" + "Ortho Coverage for Kids:  " + graphM[m].ortho
                        + "<br />" + "Major Coverage:  " + graphM[m].major;
                    dentalBox[0].append(dentalElem);
                }//end for loop
                var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["My Plan", "Average Plan"],
                        datasets: [{
                            label: 'Plan Cost in Dollars',
                            data: [graphM[0].cost, avgC],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                ;

            }//end orth if
            //no ortho displayed
            else {
                console.log(uniqueM);
                for (let i = 0; i < 4; i++) {
                    let chartOutM = {};
                    chartOutM.planName = uniqueM[i].issuer_name;
                    chartOutM.phone = uniqueM[i].customer_service_phone_number_toll_free;
                    chartOutM.cost = Number(uniqueM[i].premium_couple_21);
                    chartOutM.major = uniqueM[i].major_dental_care_adult;
                    graphM.push(chartOutM);
                }//end for loop
                var uniqueMNum = [];
                //convert string values to number couple_1_child_age_21
                uniqueM.forEach(function (element) {
                    uniqueMNum.push(Number(element.premium_couple_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo);
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphM);
                var dentalBox = document.getElementsByClassName('plan1');
                for (let m = 0; m < 4; m++) {
                    var dentalElem = document.createElement('p');
                    dentalElem.innerHTML = "Plan Name:  " + graphM[m].planName + "<br />" + "Plan Phone #:  " + graphM[m].phone +
                        "<br />" + "Cost of Dental Plan:  $" + graphM[m].cost +
                        "<br />" + "Major Coverage:  " + graphM[m].major;
                    dentalBox[0].append(dentalElem);
                }//end for loop
                var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["My Plan", "Average Plan"],
                        datasets: [{
                            label: 'Plan Cost in Dollars',
                            data: [graphM[0].cost, avgC],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                ;
            }//end ortho els        
        }//end kids if
        //else no kids  and therefor do not show ortho & no ortho logic
        else {
            for (let j = 0; j < 4; j++) {
                let chartOutM = {};
                chartOutM.planName = uniqueM[j].issuer_name;
                chartOutM.phone = uniqueM[j].customer_service_phone_number_toll_free;
                //price for couple with no kids and thus no ortho
                chartOutM.cost = Number(uniqueM[j].premium_couple_21);
                chartOutM.major = uniqueM[j].major_dental_care_adult;
                graphM.push(chartOutM);
            }//end for 
            var uniqueMNum = [];
            //convert string values to number couple_1_child_age_21
            uniqueM.forEach(function (element) {
                uniqueMNum.push(Number(element.premium_couple_21));
            });
            //remove NaN values from uniqueMNum
            var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
            console.log("filtered code");
            console.log(uniqueNaNgo);
            //max cost of plan
            var maxC = Math.max.apply(null, uniqueNaNgo);
            // min cost of plan
            var minC = Math.min.apply(null, uniqueNaNgo);
            var totalC = uniqueNaNgo.reduce(function (a, b) { return a + b; });
            //toFixed limits to 2 decimal places the avg cost
            var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
            console.log(maxC, minC, avgC);
            console.log(graphM);
            var dentalBox = document.getElementsByClassName('plan1');
            for (let m = 0; m < 4; m++) {
                var dentalElem = document.createElement('p');
                dentalElem.innerHTML = "Plan Name:  " + graphM[m].planName + "<br />" + "Plan Phone #:  " + graphM[m].phone +
                    "<br />" + "Cost of Dental Plan:  $" + graphM[m].cost +
                    "<br />" + "Major Coverage:  " + graphM[m].major;
                dentalBox[0].append(dentalElem);
            }//end for loop
            var ctx = document.getElementById("myChart");
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["My Plan", "Average Plan"],
                        datasets: [{
                            label: 'Plan Cost in Dollars',
                            data: [graphM[0].cost, avgC],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                ;
        }//end else
        return graphM;
    }//end married function

    function updateUISuccess(response) {
        //assigned the result of API call to global variable theData
        console.log(response);
        theData = response
        //sorting data from cheapest cost to most expensive
        var marriedData = theData.sort((a, b) => {
            return Number(a.couple_1_child_age_21) - b.couple_1_child_age_21;
        })
        //removing duplicate plans that have some cost for cost for married 
        var uniqueM = marriedData.filter(
            function (a) { if (!this[a.couple_1_child_age_21]) { this[a.couple_1_child_age_21] = 1; return a; } },
            {}
        );
        console.log(uniqueM);
        //sorting data from cheapest cost to most expensive
        var singleData = theData.sort((a, b) => {
            return Number(a.individual_1_child_age_21) - b.individual_1_child_age_21;
        })
        //removing duplicate plans that have same cost for cost individual
        var uniqueS = singleData.filter(
            function (a) { if (!this[a.couple_1_child_age_21]) { this[a.couple_1_child_age_21] = 1; return a; } },
            {}
        );
        console.log(uniqueS);

        if (userInput.married == true) {
            Married(userInput, uniqueM);
        }
        else {
            Individual(userInput, uniqueS);
        }
    }

    // handle XHR error
    function updateUIError() {
        var weatherBox = document.getElementById("dental");
        weatherBox.className = "hidden";
    }
})();