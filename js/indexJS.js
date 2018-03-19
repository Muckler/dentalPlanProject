(function () {
var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
    Boolean.parse = function(val) { 
     return !falsy.test(val) && !!val;
    };
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
            form.classList.add('was-validated');``
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

    $("#submitButton").click(function(e) {
        console.log(userInput);
        e.preventDefault();
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
        localStorage.setItem("marriedYN", userInput.married);
        localStorage.setItem("kidsYN", userInput.kids);
        localStorage.setItem("orthoYN", userInput.ortho);
        window.location.href = "results.html";
    })
    var url2 = "https://data.maryland.gov/api/views/8n7n-ij7b/rows.json?accessType=DOWNLOAD";
    //when we get response from API we will assign that array to theData global variable
    $.get(url2).done(function (response) {
        // let dentalStats = {};
        let dentalVisit12Mos = response.data[32][9];
        let privateDentalIns = response.data[29][9];
        let toothAche12Mos = response.data[44][9];
        // dentalStats.dentalVisit12Mos = Number(dentalVisit12Mos);
        // dentalStats.privateDentalIns = Number(privateDentalIns);
        // dentalStats.toothAche12Mos = Number(toothAche12Mos);
        $('#stat1').append(`<span class='numscroller' data-min='0' data-max=${dentalVisit12Mos} data-delay='3' data-increment='1'></span>`);
        $('#stat2').append(`<span class='numscroller' data-min='0' data-max=${privateDentalIns} data-delay='3' data-increment='1'></span>`);
        $('#stat3').append(`<span class='numscroller' data-min='0' data-max=${toothAche12Mos} data-delay='3' data-increment='1'></span>`);

        // let percentInsure = document.getElementById('stat1');
        // let percentVisit = document.getElementById('stat2');
        // let percentToothAche = document.getElementById('stat3');
        // let appendStat1 = percentInsure.appendChild('span');
    
    }).fail(function (error) {
        console.log(error);
    })

// will receive userInput object below from event listener
//var userInput = { married: false, kids: true, ortho: true };
console.log(userInput);
//married function
})();