
//*******************************Add Listener***************************************
var turn = 1;

for(var i =1 ; i <= 9; i++){
    document.querySelector('#el'+i).addEventListener('click', clicked);
}

document.querySelector('#restart').addEventListener('click', function(){
    location.reload(true);
});

//********************************Checking Game Type************************************

var type=1;
for(var i=1; i<=2; i++){
    document.getElementById('type'+i).addEventListener('click',gameChosen);
}
function gameChosen(){
    if(document.getElementById('type1').checked){
        type=1;
    }
    else if(document.getElementById('type2').checked){
        type=2;
    }
    // else{
    //     type =3;
    // }
}


//******************************Checking Turn******************************************
checkTurn();

function checkTurn(){
    if(type == 1){
        if(turn==1){
            document.querySelector('#turn').innerHTML="Your Turn";
        }
        else{
            document.querySelector('#turn').innerHTML="<p class='thinking'>Thinking<span>.</span><span>.</span><span>.</span></p>";
        }
    }
    else{
        if(turn==1){
            document.querySelector('#turn').innerHTML="Player 1";
        }
        else{
            document.querySelector('#turn').innerHTML="Player 2";
        }
    }
}

//******************************On Clicking*******************************************
function clicked(){

    if(type == 1){
        document.getElementById("label1").textContent = "Playing With Computer!!";
        document.getElementById("label1").classList.add("playing");
        document.getElementById("label2").classList.add("not-playing");

    }
    else if(type == 2){
        document.getElementById("label2").classList.add("playing");
        document.getElementById("label2").textContent = "Two Player Game!!";
        document.getElementById("label1").classList.add("not-playing");
    }

    var any = this.id;
    if(type == 1){
        if(document.querySelector('#'+any).innerHTML == ""){
            if(turn == 1){
                document.querySelector('#'+any).innerHTML = "X";
                turn = 2;
                user.push(any);
                if((user.length + comp.length) != 9||(!(compMatched())&&!(userMatched()))){       //After user it goes for computer's turn
                    setTimeout(compTuff,500);
                    checkTurn();
                }
            }
            else{
                 document.querySelector('#'+any).innerHTML = "O";
            }
        }
    }
    else if(type == 2){
        if(document.querySelector('#'+any).innerHTML == ""){
            if(turn == 1){
                document.querySelector('#'+any).innerHTML = "X";
                turn = 2;
                user.push(any);
                checkTurn();
            }
            else{
                 document.querySelector('#'+any).innerHTML = "O";
                 turn = 1;
                 comp.push(any);
                 checkTurn();
            }
        }
    }

    checkMatch();
}


//******************************Computer Logic Easy (Dead)*****************************


function findClick(){     //Computer choosing a random place for it's turn
    var choose = Math.floor(Math.random() * 9)+1;
    console.log("Choose "+choose);
    var got = checkFill(choose);
    console.log("Got "+got);
    if(got){
        return findClick();
    }
    else{
        console.log("Choosing "+choose);
        return choose;
    }
}

function checkFill(check){
    for (var c = 0 ; c<=(comp.length); c++){
        if(comp[c] == ('el'+check)){
            // checkFill();
            return true;
        }
    }
    for(var d=0;d<=(user.length)-1;d++){
        if(user[d] == ('el'+check)){
            // checkFill();
            return true;
        }
    }
    return false;
}

//********************Computer logic Tuff***********************


function compTuff(){
    var nextTurn = "el"+99;

    for(var pat=0; pat<=8; pat++){
        if(pat == 8 && nextTurn == "el99"){
            returned = findClick();
            nextTurn = "el"+ returned;
        }
        else if(nextTurn == "el99" || checkFill((nextTurn).substring(2))){
            nextTurn = fightBack(matches[pat],user);
        }
        else{
            break;
        }
    }

    console.log("Next Turn3: "+ nextTurn);
    document.querySelector('#'+nextTurn).click();
    turn = 1;
    comp.push(''+nextTurn);
    checkTurn();
    checkMatch();
}

function fightBack(matchPat, withPat){

    var matching = [];

    console.log(matchPat);
    console.log(withPat);
    for(var m =0; m<=(withPat.length)-1; m++){
        if(withPat[m]==matchPat[0]){
            matching.push(true);
            break;
        }
        else if(m==(withPat.length)-1){
            matching.push(false);
            break;
        }
    }

    for(var n =0; n<=(withPat.length)-1; n++){
        if(withPat[n]==matchPat[1]){
            matching.push(true);
            break;
        }
        else if(n==(withPat.length)-1){
            matching.push(false);
            break;
        }
    }

    for(var o =0; o<=(withPat.length)-1; o++){
        if(withPat[o]==matchPat[2]){
            matching.push(true);
            break;
        }
        else if(o==(withPat.length)-1){
            matching.push(false);
            break;
        }
    }


    console.log("Matching"+matching);

    function checkFalse(){
        console.log("Matching"+matching);
        var returning;
        if(!matching[0]){
            returning = matchPat[0];
        }
        else if(!matching[1]){
            returning = matchPat[1];
        }
        else {
            returning = matchPat[2];
        }
        console.log("Returning: "+returning);
        if(checkFill((returning).substring(2))){
            return "el"+99;
        }
        else{
            return returning;
        }
    }

    if(matching[0] && matching[1] || matching[2] && matching[0] || matching[2] && matching[1]){
        return checkFalse();
    }
    else{
        return "el"+99;
    }
}



//**************************DECLARATIONS************************

var user = [];
var comp = [];
//----------Patterns------------
var match1 = ["el1", "el2", "el3"];
var match2 = ["el1", "el4", "el7"];
var match3 = ["el1", "el5", "el9"];
var match4 = ["el4", "el5", "el6"];
var match5 = ["el2", "el5", "el8"];
var match6 = ["el3", "el5", "el7"];
var match7 = ["el8", "el9", "el7"];
var match8 = ["el3", "el6", "el9"];
var matches = [match1,match2,match3,match4,match5,match6,match7,match8]


//*************************Checking Patterns*********************

//-----------Checking Winner---------
function checkMatch(){
    if (userMatched() && (type == 1 || type == 3)){
        document.querySelector('#turn').innerHTML = "🎊🎉 You Win  🎉🎊";
        gameOver();
    }
    else if(compMatched() && (type == 1 || type == 3)){
        document.querySelector('#turn').innerHTML =  "💻 Computer Wins 😮";
        gameOver();
    }
    else if(userMatched() && type == 2){
        document.querySelector('#turn').innerHTML =  "😄 Player 1 Wins 👍";
        gameOver();
    }
    else if(compMatched() && type == 2){
        document.querySelector('#turn').innerHTML =  "😉 Player 2 Wins ✌";
        gameOver();
    }
    else if((user.length+comp.length) == 9){
        document.querySelector('#turn').innerHTML = "😑 It's A DRAW 😶";
        gameOver();
    }
}

function gameOver(){
    for(var i =1 ; i <= 9; i++){
        document.querySelector('#el'+i).removeEventListener('click', clicked);
    }
}

//----------Matching Patterns-------------
function userMatched(){
    var ugave;
    for(var us=0; us<8; us++){
        if(checkInside(matches[us],user)){
            ugave = true;
            break;
        }
        else{
            ugave = false;
        }
    }
    return ugave;
}

function compMatched(){
    var cgave;
    for(var cs=0; cs<8; cs++){
        if(checkInside(matches[cs],comp)){
            cgave = true;
            break;
        }
        else{
            cgave = false;
        }
    }
    return cgave;
}


//----------Checking Inputs---------
function checkInside(arr1, arr2){
    var progress = [];

    for(var m =0; m<=(arr2.length)-1; m++){
        if(arr2[m]==arr1[0]){
            progress.push(true);
            break;
        }
    }

    for(var n =0; n<=(arr2.length)-1; n++){
        if(arr2[n]==arr1[1]){
            progress.push(true);
            break;
        }
    }

    for(var o =0; o<=(arr2.length)-1; o++){
        if(arr2[o]==arr1[2]){
            progress.push(true);
            break;
        }
    }

    if(progress[0] && progress[1] && progress[2]){
        return true;
    }
    else{
        return false;
    }

}
