//selector

//dives
let settings_div=document.getElementById("settings");
let oprations_div=document.getElementById("oprations");
let result_div=document.getElementById("result");

//element settings
let categoryElement=document.getElementById("category");
let numbers_q_input=document.getElementById("numbers_q_input");
let difficulty_div=[
   document.getElementById("easy"),
   document.getElementById("medium"),
   document.getElementById("hard")
];
let start_btn=document.getElementById("start_btn");

//element oprations
let current_span=document.getElementById("current_span");
let total_span=document.getElementById("total_span");
let titel_q=document.getElementById("titel_q");
let answers_div=document.getElementById("answers_div");
let spans_div=document.getElementById("spans_div");
let timer_span=document.getElementById("timer_span");
let next_btn=document.getElementById("next_btn");

//element result
let answerd_span=document.getElementById("answerd_span");
let result_span=document.getElementById("result_span");
let again_btn=document.getElementById("again_btn");

/// ours varibels
let category;
let numbersQustions;
let difficulty;
let index=0;
let recordAnswer=0;
let fetch1Result;
let arrayAnswers=[];


start_btn.addEventListener("click",getData);
next_btn.addEventListener("click",next);
again_btn.addEventListener("click",function(){
    location.reload()
})

async function  getData(){
    category=categoryElement.value;
    numbersQustions=numbers_q_input.value;
    let difficulty=checkDifficulty();
    if(numbersQustions!=""&&difficulty!=null){
        if(numbersQustions>10||numbersQustions<1)
            {numbersQustions=10}
        let url=`https://opentdb.com/api.php?amount=${numbersQustions}&category=${category}&difficulty=${difficulty}`;
        let fetch1=await fetch(url);
        let fetch1Json=await fetch1.json()
         fetch1Result=await fetch1Json.results;
        
         toggelDiv(settings_div,oprations_div)
         showData(fetch1Result,index);
         spans_div.innerHTML="";
    for(let i=0;i<fetch1Result.length;i++){
        let span=document.createElement("span");
        span.className="spans bg-secondary";
        spans_div.appendChild(span);
    }
    spans_div.childNodes[index].className+=" active1"

         
         
       
    }else{
        alert("Please enter numbers or check the difficulty selection")

    }
   
    
};

function checkDifficulty(){
 let difficulty=difficulty_div.find((item)=>item.checked);
 if(difficulty){
    return difficulty.id
 }
 
}

 function showData(data,index){
    let answers
    
    if(index<data.length){
        current_span.textContent=index+1;
        total_span.textContent=numbersQustions;
        titel_q.textContent=data[index].question;
       answers =[data[index].correct_answer,...data[index].incorrect_answers];
       let randomAnswers=random(answers);
       
        answers_div.innerHTML="";
        for(let i=0;i<randomAnswers.length;i++){
            let div=document.createElement("div");
            div.className="col-12";
            let input=document.createElement("input");
            input.type="radio";
            input.name="answer";
            input.id=`r${i}`
            if(i==0){
                input.checked=true;
            }
            
            input.className="c"
            let label=document.createElement("label");
            label.setAttribute("for",`r${i}`)
            label.textContent=randomAnswers[i];
            
            div.appendChild(input);
            div.appendChild(label);
            arrayAnswers.push(input)
            answers_div.appendChild(div)
        }
    }
    

    
   
   timer(60,index,fetch1Result)
   
  
}



function toggelDiv(div1,div2){
    div1.style.display="none";
    div2.style.display="block";
}


async function next(){
    let check
if(index<fetch1Result.length){
    check=arrayAnswers.find((item)=>item.checked)
    arrayAnswers=[];
    
    if(check){
        let check2=check.nextElementSibling.textContent
        if(check2==fetch1Result[index].correct_answer){
            recordAnswer++
           
        }
    }
}
index++
if(index<fetch1Result.length){
    
        clearInterval(timerinterval)
        showData(await fetch1Result,index)
        spans_div.childNodes[index].className+=" active1"
   

}else{
    toggelDiv(oprations_div,result_div);
    answerd_span.textContent=`You Answered${recordAnswer} from ${numbersQustions}`;
    grade(recordAnswer,numbersQustions)
}
  
}
function timer(tim,index,data){
    if(index<data.length){
        timerinterval=setInterval(function(){
            let minutes=parseInt(tim/60);
            let seconds=parseInt(tim%60);
            minutes=minutes<10?`0${minutes}`:minutes;
            seconds=seconds<10?`0${seconds}`:seconds;
            timer_span.textContent=`${minutes}:${seconds}`
            --tim
            if(tim<0){
               
              

                clearInterval(timerinterval)
                    next_btn.click();
                
            

            }


        },1000)
    }
   
}


function random(array){
    let array2=[];
    for(let i=0;i<100;i++){
        let num=Math.floor(Math.random()*array.length)
      
       let s=array2.find((item)=>item==array[num])
     
       if(s==null){
        array2.push(array[num])
       }
       
    }
    return array2
}


function grade(result,total){
    let test=total/2
    if(result==total){
        result_span.textContent="Excellent"
    }
    else if(result>test && result<total){
        result_span.textContent="Good";
    }else{
        result_span.textContent="Unfortunately, try again"
    }
}
