// <![CDATA[

var objNewWindow;

/*
   * Oeffnen eines neuen Fensters
   *
   * @param string wUrl der Seite, die aufgerufen werden soll
   * @param string wName Name des Fensters
   * @param string wPage Eigenschaften des Fensters
*/
/*
	* Beispiel: Einbau in a tag 
	* onclick="javascript:CheckWindow(this.href,'GlossaryInternal','width=300,height=200,toolbar=no,location=no, directories=no,status=no, menubar=no, scrollbars=no, copyhistory=no, resizable=yes, left=0, top=0, screenX=0, screenY=0');return false;"> 
*/

function OpenNewWindow(wUrl,wName,wProperties) {
	eval("objNewWindow= window.open('"+wUrl+"','"+wName+"','"+wProperties+"')");
	window.setTimeout("objNewWindow.focus()",50);
}


/*
   * Pruefung auf Existenz geoeffneter Fenster und ggf. Oeffnen des Fensters
   *
   * @param string wUrl der Seite, die aufgerufen werden soll
   * @param string wName Name des Fensters
   * @param string wPage Eigenschaften des Fensters
*/

function CheckWindow(wUrl,wName,wProperties) {
	if(!objNewWindow) {
		/* Neues Fenster, da noch nicht vorhanden */
		OpenNewWindow(wUrl,wName,wProperties);
	}
	if(objNewWindow.closed == true) {
		/* Neues Fenster, da bereits es geschlossen wurde */
		OpenNewWindow(wUrl,wName,wProperties);
	}
	else {
		/* Fenster vorhanden, Inhalt wechseln*/
		objNewWindow.location=wUrl;
		objNewWindow.focus();
	}
}

// ]]>

