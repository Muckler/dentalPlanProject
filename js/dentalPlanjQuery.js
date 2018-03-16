(function () {
    "use strict";
    var userInput = {married: false, kids: false, ortho: false};

    window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
    }, false);

    $(".hidden").prop("disabled", true);

    $(".kids").change(function() {
        console.log(this);
        if (this.value === "Yes") {
            $(".hidden").prop("disabled", false);   
        } else {
            $(".hidden").prop("disabled", true);   
        }
    })

    $("#submitButton").click(function() {
        console.log(userInput);
        let marriedYN = $("#maritalStatus option:selected").val();
        let kidsYN = $("#kidsYN option:selected").val();
        let orthoYN = $("#orthoYN option:selected").val();
        if (marriedYN === "" || kidsYN === "") {
            console.log(userInput);
            return alert("Please fill out form completely");
        }
        // let userInput = {married: false, kids: false, ortho: false};
        if(marriedYN === "Yes") {
            userInput.married = true;
            console.log(userInput);
        }
        if (kidsYN === "Yes") {
            userInput.kids = true;
            console.log(userInput);
        }
        if (orthoYN === "Yes") {
            userInput.ortho = true;
            console.log(userInput);
        }
        console.log(userInput);
    })

    //api url from https://dev.socrata.com/foundry/data.healthcare.gov/dtk6-f38y
    var url = "https://data.healthcare.gov/resource/dtk6-f38y.json";
    // API for Maryland schoolchildren data (Kindergarten  & 3rd grade)
    var url2 = "https://data.maryland.gov/api/views/8n7n-ij7b/rows.json?accessType=DOWNLOAD";
    //when we get response from API we will assign that array to theData global variable
    var theData = {};

    //global variable because several functions use it
    $.get(url).done(function (response) {
        updateUISuccess(response);
    }).fail(function (error) {
        console.log(error);
    })

        $.get(url2).done(function (response) {
            // let dentalStats = {};
            let dentalVisit12Mos = response.data[32][9];
            let privateDentalIns = response.data[29][9];
            let toothAche12Mos = response.data[44][9];
            // dentalStats.dentalVisit12Mos = Number(dentalVisit12Mos);
            // dentalStats.privateDentalIns = Number(privateDentalIns);
            // dentalStats.toothAche12Mos = Number(toothAche12Mos);
            $('#stat1').append(`<span class='numscroller' data-min='0' data-max=${dentalVisit12Mos} data-delay='3' data-increment='1'></span><span style="font-size:45px;">%</span>`);
            $('#stat2').append(`<span class='numscroller' data-min='0' data-max=${privateDentalIns} data-delay='3' data-increment='1'></span><span style="font-size:45px;">%</span>`);
            $('#stat3').append(`<span class='numscroller' data-min='0' data-max=${toothAche12Mos} data-delay='3' data-increment='1'></span><span style="font-size:45px;">%</span>`);

            // let percentInsure = document.getElementById('stat1');
            // let percentVisit = document.getElementById('stat2');
            // let percentToothAche = document.getElementById('stat3');
            // let appendStat1 = percentInsure.appendChild('span');
        
        }).fail(function (error) {
            console.log(error);
        })

    // will receive userInput object below from event listener
    var userInput = { married: false, kids: false, ortho: true };
    console.log(userInput);
    //married function
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
                uniqueS.forEach(function(element) {
                    uniqueMNum.push(Number(element.individual_1_child_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);  
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo) ;
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function(a,b) {return a + b;});
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphS);
            }//end ortho if
            //need else if no ortho and have kids
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
                uniqueS.forEach(function(element) {
                    uniqueMNum.push(Number(element.premium_adult_individual_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);  
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo) ;
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function(a,b) {return a + b;});
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
            console.log(graphS);
        }//end else no kids
         return graphS;
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
                var uniqueMNum = [];
                //convert string values to number couple_1_child_age_21
                uniqueM.forEach(function(element) {
                    uniqueMNum.push(Number(element.couple_1_child_age_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);  
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo) ;
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function(a,b) {return a + b;});
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphM);
                //will return value of graphMKO instead of below to insert in graphic
                //below code will be deleted when integrate with html

                $('#plan1-name').innerHTML = "Plan Name: " + graphM[m].planName;

                for (let m = 0; m < 4; m++) {dentalBox.innerHTML = "<p>" + "Plane Name:  " + graphM[m].planName+ "<br />" + "Plan Phone #:  " + graphM[m].phone +
                "<br />" + "Cost of Dental Plan:  " + graphM[m].cost +
                "<br />" + "Ortho Coverage for Kids:  " + graphM[m].ortho
                + "<br />" + "<br />" + "<br />" + "Major Coverage:  " + graphM[m].major + "</p>";}
                
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
                uniqueM.forEach(function(element) {
                    uniqueMNum.push(Number(element.premium_couple_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);  
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo) ;
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function(a,b) {return a + b;});
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphM);
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
                uniqueM.forEach(function(element) {
                    uniqueMNum.push(Number(element.premium_couple_21));
                });
                //remove NaN values from uniqueMNum
                var uniqueNaNgo = uniqueMNum.filter(unique => unique >= 0);
                console.log("filtered code");
                console.log(uniqueNaNgo);  
                //max cost of plan
                var maxC = Math.max.apply(null, uniqueNaNgo) ;
                // min cost of plan
                var minC = Math.min.apply(null, uniqueNaNgo);
                var totalC = uniqueNaNgo.reduce(function(a,b) {return a + b;});
                //toFixed limits to 2 decimal places the avg cost
                var avgC = (totalC / uniqueNaNgo.length).toFixed(2);
                console.log(maxC, minC, avgC);
                console.log(graphM);
       
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
            function(a){if (!this[a.couple_1_child_age_21]) {this[a.couple_1_child_age_21] = 1; return a;}},
            {}
           );
        console.log(uniqueM);
        //sorting data from cheapest cost to most expensive
        var singleData = theData.sort((a, b) => {
            return Number(a.individual_1_child_age_21) - b.individual_1_child_age_21;
        })
        //removing duplicate plans that have same cost for cost individual
        var uniqueS = singleData.filter(
            function(a){if (!this[a.couple_1_child_age_21]) {this[a.couple_1_child_age_21] = 1; return a;}},
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