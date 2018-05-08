//*******************************Add Listener***************************************

for(var i =1 ; i <= 9; i++){
 	document.querySelector('#el'+i).addEventListener('click', clicked);
}
document.querySelector('#restart').addEventListener('click', function(){
    location.reload(true);
});

//******************************Checking Turn******************************************
checkTurn();

function checkTurn(){
	if(turn==1){
		document.querySelector('#turn').innerHTML="Your Turn";
	}
	else{
		document.querySelector('#turn').innerHTML="Thinking...";
	}
}

//******************************On Clicking*******************************************
function clicked(){
	var any = this.id;
	if(document.querySelector('#'+any).innerHTML == ""){
		if(turn == 1){
			document.querySelector('#'+any).innerHTML = "X";
			turn = 2;
			user.push(any);
            if((user.length + comp.length) != 9||!(compMatched())||!(userMatched())){       //After user it goes for computer's turn
                console.log("here");
                setTimeout(compEasy,500);
                checkTurn();
            }
		}
		else{
		     document.querySelector('#'+any).innerHTML = "O";                  //Change Here FOR 2 Player Game
		}
	}
    checkMatch();
}
//******************************Computer Logic*****************************

function compEasy(){     //this is an easy version...difficult version is on the way !!!!
    var chose=findClick();
    if(chose == 40){
        compEasy();
        return 10;
    }
    document.querySelector('#el'+chose).click();
    turn = 1;
    comp.push('el'+chose);
    checkTurn();
	checkMatch();
}

function findClick(){     //Computer choosing a random place for it's turn
    var choose = Math.floor(Math.random() * 9)+1;
    for (var c = 0 ; c<=(comp.length); c++){
        if(comp[c] == ('el'+choose)){
            findClick();
            return 40;
        }
    }
    for(var d=0;d<=(user.length)-1;d++){
        if(user[d] == ('el'+choose)){
            findClick();
            return 40;
        }
    }
    return choose;
}

//**************************DECLARATIONS************************
var turn = 1;
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


//*************************Checking Patterns*********************

//-----------Checking Winner---------
function checkMatch(){
	if (userMatched()){
		document.querySelector('#turn').innerHTML = "🎊🎉 You Won 🎉🎊";
        gameOver();
	}
	else if(compMatched()){
		document.querySelector('#turn').innerHTML = "💻 Computer Won 🤨";
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
	if(checkInside(match1,user) || checkInside(match2,user) || checkInside(match3,user) || checkInside(match4,user) || checkInside(match5,user) || checkInside(match6,user) || checkInside(match7,user) || checkInside(match8,user)){
		ugave = true;
	}
	else{
		ugave = false;
	}
	return ugave;
}

function compMatched(){
	var cgave;
	if(checkInside(match1,comp) || checkInside(match2,comp) || checkInside(match3,comp) || checkInside(match4,comp) || checkInside(match5,comp) || checkInside(match6,comp) || checkInside(match7,comp) || checkInside(match8,comp)){
		cgave = true;
	}
	else{
		cgave = false;
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
