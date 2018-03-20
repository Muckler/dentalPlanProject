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
        e.preventDefault();
        let marriedYN = $("#maritalStatus option:selected").val();
        let kidsYN = $("#kidsYN option:selected").val();
        let orthoYN = $("#orthoYN option:selected").val();
        if (marriedYN === "" || kidsYN === "") {
            console.log(userInput);
            return alert("Please fill out form completely");
        }
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
        let dentalVisit12Mos = response.data[32][9];
        let privateDentalIns = response.data[29][9];
        let toothAche12Mos = response.data[44][9];
        $('#stat1').prepend(`<span class='numscroller' data-min='0' data-max=${dentalVisit12Mos} data-delay='3' data-increment='1'></span><span class='numscroller'>%</span>`);
        $('#stat2').prepend(`<span class='numscroller' data-min='0' data-max=${privateDentalIns} data-delay='3' data-increment='1'></span><span class='numscroller'>%</span>`);
        $('#stat3').prepend(`<span class='numscroller' data-min='0' data-max=${toothAche12Mos} data-delay='3' data-increment='1'></span><span class='numscroller'>%</span>`);
    }).fail(function (error) {
        console.log(error);
    })
})();