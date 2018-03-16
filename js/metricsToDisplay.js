//calculating the metrics file 
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