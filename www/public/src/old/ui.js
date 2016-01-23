function pageStart(){

}

function locationHashChanged() {
    if (location.hash === "#NOC_W01") {
        studySelect("studyContent_01");
    } else if (location.hash === "#NOC_W02") {
        studySelect("studyContent_02");
    } else if (location.hash === "#DTS_W01") {
        studySelect("studyContent_03");
    } else if (location.hash === "#NOC_W03") {
        studySelect("studyContent_05");
    } else if (location.hash === "#NOC_W04") {
        studySelect("studyContent_06");
    } else if (location.hash === "#ICM_W01") {
        studySelect("studyContent_07");
    } else if (location.hash === "#StrangeAttractor") {
        studySelect("studyContent_11");
    } else if (location.hash === "#NOC_W06") {
        studySelect("studyContent_14");
    } else if (location.hash === "#CG_W02"){
        studySelect("studyContent_15");
    } else if (location.hash === "#PA2Z_W02"){
        studySelect("studyContent_16");
    } else if (location.hash === "#CG_W03"){
        studySelect("studyContent_17");
    } else if (location.hash === "#PA2Z_W03"){
        studySelect("studyContent_18");
    } else if (location.hash === "#CG_W04"){
        studySelect("studyContent_19");
    }
    
}


function select(selectedId){
    $( "#contents" ).load( "public/src/html/content.html #" + selectedId  );
    var content = document.getElementById(container);
    console.log(selectedId);
    window.location.hash = '#' + selectedId;

    /* turn off about */
    document.getElementById("profile").setAttribute("class", "hidden");
    document.getElementById("about").setAttribute("class", "hidden");
    
    /* go to top */
    $('#container').ScrollTo();
}

function studySelect(selectedId){
    $( "#contents" ).load( "public/src/html/studyContent.html #" + selectedId  );
    window.location.hash = '#' + selectedId;
    
//    alert("also this" + selectedId);
    /* turn off about */
    document.getElementById("profile").setAttribute("class", "hidden");
    document.getElementById("about").setAttribute("class", "hidden");
    
    /* go to top */
    $('#container').ScrollTo();
}

function goToProfile(){
    var list = document.getElementById("contents");
    while (list.hasChildNodes()) {   
        list.removeChild(list.firstChild);
    }
        
    
    document.getElementById("profile").setAttribute("class", "showed");
    document.getElementById("about").setAttribute("class", "showed");
    
    $('#profile').ScrollTo();
}

function goToAbout(){
    var list = document.getElementById("contents");
    while (list.hasChildNodes()) {   
        list.removeChild(list.firstChild);
    }
    
    
    document.getElementById("profile").setAttribute("class", "showed");
    document.getElementById("about").setAttribute("class", "showed");
    
    $('#about').ScrollTo();
}

function goToGrid(){
    $('#grid').ScrollTo();
}

function goToStudyGrid(){
    $('#studyGrid').ScrollTo();
}

//script starts here
window.addEventListener('load', pageStart);

//p5.js requires setup
function setup(){}
