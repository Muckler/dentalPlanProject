// Dan's java script

$(".hidden").prop("disabled", true);

// $("#yesKids").on("select", function() {
//     console.log("select kids");
//     $(".hidden").prop("disabled", false);
// })

// let kidsYN = $(".kids option:selected").text();
// console.log(kidsYN);

$(".kids").change(function() {
    console.log(this);
    if (this.value === "Yes") {
        $(".hidden").prop("disabled", false);   
    }

})

$("#submitButton").click(function() {
    
    let marriedYN = $("#maritalStatus option:selected").val();
    let kidsYN = $("#kidsYN option:selected").val();
    let orthoYN = $("#orthoYN option:selected").val();

    // if (marriedYN === "" || kidsYN === "") {
    //     return alert("Please fill out form completely");
    
    // }

    let userInput = {married: false, kids: false, ortho: false};
    
    if(marriedYN === "Yes") {
        userInput.married = true;
    }

    if (kidsYN === "Yes") {
        userInput.kids = true;
    }

    if (orthoYN === "Yes") {
        userInput.ortho = true;
    }
    
    console.log(userInput);

})
