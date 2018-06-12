if (location.protocol != 'https:')
{
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

//*******************************Add Listener***************************************
var turn = 1;

for(var i =1 ; i <= 9; i++){
    document.querySelector('#el'+i).addEventListener('click', clicked);
}

document.querySelector('#restart').addEventListener('click', function(){
    location.reload(true);
});



//********************************Checking Game Type************************************

var type=3;
for(var i=1; i<=3; i++){
    document.getElementById('type'+i).addEventListener('click',gameChosen);
}
function gameChosen(){
    if(document.getElementById('type1').checked){
        type=1;
    }
    else if(document.getElementById('type2').checked){
        type=2;
    }
    else{
        type =3;
    }
}


//******************************Checking Turn******************************************
checkTurn();

function checkTurn(){
    var turnSelect = document.querySelector('#turn');
    if(type == 1 || type == 3){
        if(turn==1){
            turnSelect.innerHTML="Your Turn";
        }
        else{
            turnSelect.innerHTML="<p class='thinking'>Thinking<span>.</span><span>.</span><span>.</span></p>";
        }
    }
    else{
        if(turn==1){
            turnSelect.innerHTML="Player 1";
        }
        else{
            turnSelect.innerHTML="Player 2";
        }
    }
}

//******************************On Clicking*******************************************
function clicked(){

    if(type == 1){
        document.getElementById("label1").innerHTML = "Playing With Computer!! <i class='fas fa-laptop'></i>";
        document.getElementById("label1").classList.add("playing");
        document.getElementById("label2").classList.add("not-playing");
        document.getElementById("label3").classList.add("not-playing");
    }
    else if(type == 2){
        document.getElementById("label2").classList.add("playing");
        document.getElementById("label2").innerHTML = "Two Player Game!! <i class='fas fa-user-friends'></i>";
        document.getElementById("label1").classList.add("not-playing");
        document.getElementById("label3").classList.add("not-playing");
    }
    else{
        document.getElementById("label3").classList.add("playing");
        document.getElementById("label3").innerHTML = "Try Your best!! <i class='far fa-thumbs-up'></i>";
        document.getElementById("label1").classList.add("not-playing");
        document.getElementById("label2").classList.add("not-playing");
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
    else{
        if(document.querySelector('#'+any).innerHTML == ""){
            if(turn == 1){
                document.querySelector('#'+any).innerHTML = "X";
                turn = 2;
                user.push(any);
                if((user.length + comp.length) != 9||(!(compMatched())&&(userMatched()))){
                    setTimeout(compDone,250);
                    checkTurn();
                }
            }
            else{
                 document.querySelector('#'+any).innerHTML = "O";
            }
        }
    }

    checkMatch();
}

//******************************Computer Logic Easy (Dead)*****************************


function findClick(){     //Computer choosing a random place for it's turn
    var choose = Math.floor(Math.random() * 9)+1;
    var got = checkFill(choose);
    if(got){
        return findClick();
    }
    else{
        return choose;
    }
}

function checkFill(check){  //Checking if the nexturn is filled or not
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

    document.querySelector('#'+nextTurn).click();
    turn = 1;
    comp.push(''+nextTurn);
    checkTurn();
    checkMatch();
}

function fightBack(matchPat, withPat){  //Telling if the MAtch is being completed and giving the value to stop the match

    var matching = [];
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

    function checkFalse(){
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

//**************************************Comp Done***********************************************

function compDone(){
    var nextTurn = "el"+99;
    //Check if computer is completing a match
    for(var pat=0; pat<8; pat++){
        if(nextTurn == "el99" ||checkFill((nextTurn).substring(2))){
            nextTurn = fightBack(matches[pat],comp);
        }
    }

    //Check if users completing match
    for(var pat=0; pat<8; pat++){
        if(nextTurn == "el99" ||checkFill((nextTurn).substring(2))){
            nextTurn = fightBack(matches[pat],user);
        }
    }
    //Check the users placement
    if(nextTurn == "el99"){
        nextTurn = 'el'+accordingUser();
    }

    //completing Comp's Move
    document.querySelector('#'+nextTurn).click();
    turn = 1;
    comp.push(''+nextTurn);
    checkTurn();
    checkMatch();
}

function accordingUser(){
    var see;
    eve= [1,3];
    eve2 = [1,7];
    eve3 = [3,9];
    eve4 = [9,7]
    even = [1,3,7,9];
    var lastUser = (user[((user.length)-1)].substring(2))-0;
    if(user.length == 1){
        if(lastUser%2 == 0){
            if(lastUser ==2){
                ins = eve;
            }
            else if(lastUser == 4){
                ins = eve2;
            }
            else if(lastUser == 6){
                ins = eve3;
            }
            else{
                ins = eve4;
            }
            see = ins[(Math.floor(Math.random()*2))];
        }
        else if(lastUser == 5){
            see = even[(Math.floor(Math.random()*4))]
        }
        else{
            see = 5;
        }
    }
    else{
        see = returnPat().substring(2);
    }
    if(checkFill(see)){
        return accordingUser();
    }
    return see;
}

function twoArray(arr1, arr2){
    console.log("Iside 2arr = "+arr1+" 2 " + arr2);
    for(one =0 ; one<arr1.length; one++){
        if(arr2.includes(arr1[one])){
            console.log("Returning true");
            return true;
        }
    }
    return false;
}

function checkUser(element){
    console.log("CheckUser"+ element);
    for(var ch = 0; ch<8; ch++){
        if(matches[ch].includes(element)&& twoArray(matches[ch],user)){
            return true;
        }
    }
    // return false;
}

function returnPat(){
    var watching;
    var selecting =0;
    for(var cloop=0; cloop<comp.length; cloop++){
        console.log(comp.length);
        for(var cpat=0 ; cpat<8; cpat++){
            console.log("All "+matches[cpat]);
            if(matches[cpat].includes(comp[cloop])){
                if(twoArray(matches[cpat], user)){
                }
                else{
                    console.log("Without user "+matches[cpat]);
                    if(matches[cpat].includes("el"+5) && !(checkFill(5))){
                        console.log("Matching 5");
                        watching = "el"+5;
                    }
                    else if( !(checkFill((matches[cpat][0]).substring(2))) && checkUser(matches[cpat][0]) ){
                            watching = (matches[cpat][0]);
                    }
                    else if( !(checkFill((matches[cpat][1]).substring(2))) && checkUser(matches[cpat][1]) ){
                            watching = (matches[cpat][1]);
                    }
                    else{
                        if(checkUser(matches[cpat][2])){
                            watching = (matches[cpat][2]);
                        }
                    }
                    console.log(selecting + "selecting");
                    if(checkFill(watching.substring(2))){
                        console.log(selecting+ "for check filling");
                        continue;
                    }
                    else if(selecting == "el5" && !(checkFill(5)) ){
                        watching  = "el5";
                        return watching;
                    }
                    else if(cpat !=7 && cloop <= comp.length-1){
                        selecting = watching;
                        console.log(selecting + "for continuing");
                        continue;
                    }
                }
            }
            if(cpat == 7 && cloop == comp.length-1 && selecting !=0){
                console.log(selecting + "Fnal");
                return watching;
            }
        }
        if(cloop == comp.length-1){
            console.log("giving random");
            return "el"+findClick();
        }
    }
}


//**************************DECLARATIONS************************

var user = [];
var comp = [];
//----------Patterns------------
var match1 = ["el1", "el2", "el3"];
var match2 = ["el1", "el5", "el9"];
var match3 = ["el1", "el4", "el7"];
var match4 = ["el4", "el5", "el6"];
var match5 = ["el2", "el5", "el8"];
var match6 = ["el7", "el8", "el9"];
var match7 = ["el3", "el5", "el7"];
var match8 = ["el3", "el6", "el9"];

var matches = [match1,match2,match3,match4,match5,match6,match7,match8]


//*************************Checking Patterns*********************

//-----------Checking Winner---------
function checkMatch(){
    if (userMatched() && (type == 1 || type == 3)){
        document.querySelector('#turn').innerHTML = "🎊You Win🎉";
        gameOver();
    }
    else if(compMatched() && (type == 1 || type == 3)){
        document.querySelector('#turn').innerHTML =  "💻Computer Wins😮";
        gameOver();
    }
    else if(userMatched() && type == 2){
        document.querySelector('#turn').innerHTML =  "😄Player 1 Wins👍";
        gameOver();
    }
    else if(compMatched() && type == 2){
        document.querySelector('#turn').innerHTML =  "😉Player 2 Wins✌";
        gameOver();
    }
    else if((user.length+comp.length) == 9){
        document.querySelector('#turn').innerHTML = "😑It's A DRAW😶";
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
