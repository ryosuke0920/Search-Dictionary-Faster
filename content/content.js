(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 200;
	const LINK_NODE_DEFAULT_WIDTH = 320;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SCROLL_SPACE = 17;
	const RECT_SPACE = 3;
	const SCROLL_BAR_WIDTH = 22;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_MIN_SIZE = 0.6;
	const ANCHOR_RESIO = 0.1;
	const SILENT_ERROR_PREFIX = "[silent]";
	const SILENT_ERROR_REGEX = new RegExp( /^\[silent\]/ );
	const REMOVE_SPACE_REGEX = new RegExp( /(?:\s|\|)+/, "g" );
	const API_QUERY_DERAY = 1000;
	const LINK_LIST_CLOSE_TIME = 500;
	const FOOTER_CONTENT = "Provided by Wiktionary under Creative Commons Attribution-Share Alike 3.0";//https://www.mediawiki.org/wiki/API:Licensing
	const API_TEXT_MAX_LENGTH = 255;
	const API_TEXT_MAX_LENGTH_ERROR = "max length error";
	const API_WHITE_SPACE_ERROR = "white space error";

	let widgetNode;
	let widgetNodeTop = 0;
	let widgetNodeLeft = 0;

	let linkListNode;
	let linkListNodeHeight = LINK_NODE_DEFAULT_HEIGHT;
	let linkListNodeWidth = LINK_NODE_DEFAULT_WIDTH;
	let widgetScrollTopTmp = 0;
	let widgetScrollleftTmp = 0;
	let linkListAction = LINK_LIST_ACTION_MOUSECLICK;
	let coverNode;
	let optionList = [];
	let linkListFlag = false;
	let shiftKeyFlag = false;
	let ctrlKeyFlag = false;
	let resizeWatcherFlag = false;
	let anchorSize = ANCHOR_DEFAULT_SIZE;
	let menuNode;
	let containerNode;
	let apiContentNode;
	let apiTitleNode;
	let apiBodyNode;
	let mousedownFlag = false;
	let selectionChangedFlag = false;
	let faviconCache = {};
	let apiRequestQueue = {};
	let fetchRequestID = (()=>{ let id = 0; return ()=>{return ++id} })();
	let serviceCode = API_SERVICE_CODE_NONE;
	let languageFilter = [];
	let apiCutOut = true;
	let apiFooterNode;
	let apiSwitcheNode;
	let windowId = Math.random();
	let arrowNode;
	let moveObj;
	let historyButtoneNode;
	let historyDoneButtoneNode;

	Promise.resolve()
		.then(init)
		.then(
			()=>{ return Promise.resolve().then(loadSetting).then(addCommonLinkListEvents); },
			silentError
		).catch(unexpectedError);

	function init(){
		let body = document.querySelector("body");
		if( !body ){
			/* break promise chain, but not need notification. */
			throw( new Error( SILENT_ERROR_PREFIX + " not found body") );
		}

		widgetNode = document.createElement("div");
		widgetNode.style.padding = LINK_NODE_PADDING + "px";
		widgetNode.setAttribute("id",CSS_PREFIX+"-widget");
		hide(widgetNode);
		body.appendChild( widgetNode );

		let shadow = widgetNode.attachShadow({"mode": "open"});

		let style = document.createElement("style");
		style.textContent = `
		* {
			padding: 0;
			margin: 0;
			user-select: none;
			-moz-user-select: none;
		}
		#lessLaborGoToDictionary-viewer {
			position: relative;
			font-family: sans-serif;
			font-size: 1em;
		}
		#lessLaborGoToDictionary-cover {
			display: none;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			cursor: pointer;
		}
		.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-cover {
			display: block;
		}
		#lessLaborGoToDictionary-menu {
			height: 22px;
			line-height: 0;
			white-space: nowrap;
			padding-top: 5px;
			padding-left: 5px;
		}
		.lessLaborGoToDictionary-buttonIcon {
			display: inline-block;
			height: 16px;
			width: 16px;
			cursor: pointer;
			box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
			margin-right: 5px;
		}
		#lessLaborGoToDictionary-move {
			cursor: move;
		}
		.lessLaborGoToDictionary-separator #lessLaborGoToDictionary-grid {
			display: grid;
			grid-template-columns: min-content auto;
		}
		.lessLaborGoToDictionary-list {
			display: block;
			padding-left: 5px;
			white-space: nowrap;
		}
		.lessLaborGoToDictionary-inline .lessLaborGoToDictionary-list {
			display: inline;
			white-space: normal;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list {
			color: white;
			border-top: 2px solid #505050;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list:hover {
			background-color:#505050;
		}
		.lessLaborGoToDictionary-anchor,
		.lessLaborGoToDictionary-anchor:link {
			text-decoration: none;
		}
		.lessLaborGoToDictionary-anchor:hover {
			text-decoration: underline;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor,
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:link {
			color: white;
			text-decoration: none;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:visited {
			color: #B0B0B0;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:hover {
			text-decoration: none;
		}
		.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:active {
			color: #F07070;
		}
		.lessLaborGoToDictionary-favicon {
			margin: auto;
		}
		.lessLaborGoToDictionary-label {
			cursor: pointer;
			margin-left: 5px;
		}
		.lessLaborGoToDictionary-mini .lessLaborGoToDictionary-label {
			display: none;
		}
		#lessLaborGoToDictionary-apiContent {
			border-radius: 10px;
			margin:5px;
			font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans',sans-serif;
			font-size: 14px;
			line-height: 1.7em;
		}
		#lessLaborGoToDictionary-apiContent a {
			color: #3366cc;
				 text-decoration: none;
		}
		#lessLaborGoToDictionary-apiContent a:visited {
			color: #551a8b;
		}
		#lessLaborGoToDictionary-apiContent a:hover {
			text-decoration: underline;
		}
		#lessLaborGoToDictionary-apiContent a:active {
			color: #ee0000;
		}
		#lessLaborGoToDictionary-apiContent.lessLaborGoToDictionary-hide {
			display: none;
		}
		#lessLaborGoToDictionary-apiContent > *{
			border-right: solid 1px gray;
			border-left: solid 1px gray;
			background-color: white;
			padding:5px 10px;
		}
		#lessLaborGoToDictionary-apiHeader {
			position: relative;
			border-top: solid 1px gray;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			padding-right: 40px;
			background-color:#eaecf0;
		}
		#lessLaborGoToDictionary-apiFooter {
			border-bottom: solid 1px gray;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			font-size:0.9em;
			background-color:#eaecf0;
		}
		.lessLaborGoToDictionary-checkboxButton {
			position: absolute;
			background-color: gray;
			display: inline-block;
			height: 20px;
			width: 30px;
			border-radius: 15px;
			right: 0.5em;
			cursor: pointer;
		}
		.lessLaborGoToDictionary-circle {
			position: absolute;
			background: linear-gradient(to bottom, #FFFFFF, #F0F0F0 );
			display: inline-block;
			border-radius: 8px;
			height: 16px;
			width: 16px;
			top: 2px;
			left: 2px;
			cursor: pointer;
		}
		.lessLaborGoToDictionary-checkboxButton[data-checked="1"] {
			background-color: #5bd94d;
		}
		.lessLaborGoToDictionary-checkboxButton[data-checked="1"] .lessLaborGoToDictionary-circle {
			left: unset;
			right: 2px;
		}
		#lessLaborGoToDictionary-history.lessLaborGoToDictionary-hide,
		#lessLaborGoToDictionary-historyDone.lessLaborGoToDictionary-hide {
			display: none;
		}
		#lessLaborGoToDictionary-historyDone {
			cursor: auto;
		}
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiTitleWrapper,
		.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiTitleWrapper {
			display: none;
		}
		#lessLaborGoToDictionary-apiTitle {
			font-size: 1.1em;
			font-weight: bold;
			cursor: pointer;
			color: #3366cc;
		}
		#lessLaborGoToDictionary-apiTitle:visited {
			color: #551a8b;
		}
		#lessLaborGoToDictionary-apiTitle:hover {
			text-decoration: underline;
		}
		#lessLaborGoToDictionary-apiTitle:active {
			color: #ee0000;
		}
		#lessLaborGoToDictionary-nowLoadingMsg {
			display: none;
		}
		.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-nowLoadingMsg {
			display: inline;
		}
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-nowLoadingMsg {
			display: none;
		}
		#lessLaborGoToDictionary-apiOffMsg {
			display: none;
		}
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOffMsg {
			display: inline;
		}
		#lessLaborGoToDictionary-apiLoading {
			display: none;
			height: 5em;
		}
		.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiLoading {
			display: block;
		}
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiLoading {
			display: none;
		}
		#lessLaborGoToDictionary-apiLoadingContent {
			background-repeat: no-repeat;
			background-position: center;
			height:100%;
			animation: loading 2s ease-out 0s infinite running;
			background-size: 0%;
			opacity: 1;
		}
		@keyframes loading {
			0%{
				background-size: 0%;
				opacity: 1;
			}
			50%{
				background-size: 100%;
				opacity: 0;
			}
			100%{
				background-size: 100%;
				opacity: 0;
			}
		}
		#lessLaborGoToDictionary-apiOff {
			display: none;
			font-size: 0.9em;
		}
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOff {
			display: block;
		}
		.lessLaborGoToDictionary-warning {
			color: red;
			font-weight: bold;
		}
		.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiBody,
		.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiBody {
			display: none;
		}
		#lessLaborGoToDictionary-apiBody h1,
		#lessLaborGoToDictionary-apiBody h2,
		#lessLaborGoToDictionary-apiBody h3,
		#lessLaborGoToDictionary-apiBody h4,
		#lessLaborGoToDictionary-apiBody h5,
		#lessLaborGoToDictionary-apiBody h6,
		#lessLaborGoToDictionary-apiBody div,
		#lessLaborGoToDictionary-apiBody p,
		#lessLaborGoToDictionary-apiBody ol,
		#lessLaborGoToDictionary-apiBody ul,
		#lessLaborGoToDictionary-apiBody dl,
		#lessLaborGoToDictionary-apiBody dt,
		#lessLaborGoToDictionary-apiBody dd,
		#lessLaborGoToDictionary-apiBody table {
			margin-bottom: 0.5em;
		}
		#lessLaborGoToDictionary-apiBody h1 {
			font-size: 1.30em;
		}
		#lessLaborGoToDictionary-apiBody h2 {
			font-size: 1.25em;
		}
		#lessLaborGoToDictionary-apiBody h3 {
			font-size: 1.20em;
		}
		#lessLaborGoToDictionary-apiBody h4 {
			font-size: 1.15em;
		}
		#lessLaborGoToDictionary-apiBody h5 {
			font-size: 1.10em;
		}
		#lessLaborGoToDictionary-apiBody h6 {
			font-size: 1.05em;
		}
		#lessLaborGoToDictionary-apiBody ul,
		#lessLaborGoToDictionary-apiBody ol {
			margin-left: 1em;
		}
		#lessLaborGoToDictionary-apiBody table {
			border-collapse: collapse;
		}
		#lessLaborGoToDictionary-apiBody caption {
			text-align: left;
		}
		#lessLaborGoToDictionary-apiBody th, #lessLaborGoToDictionary-apiBody td {
			border: 1px solid black;
			padding: 5px;
			text-align: left;
		}
		#lessLaborGoToDictionary-apiBody th {
			background-color: #f9f9f9;
			font-weight: bold;
		}
		#lessLaborGoToDictionary-apiBody h1.in-block,
		#lessLaborGoToDictionary-apiBody h2.in-block,
		#lessLaborGoToDictionary-apiBody h3.in-block,
		#lessLaborGoToDictionary-apiBody h4.in-block,
		#lessLaborGoToDictionary-apiBody h5.in-block,
		#lessLaborGoToDictionary-apiBody h6.in-block {
			border-bottom: solid 2px black;
		}
		#lessLaborGoToDictionary-apiBody h2.in-block {
			font-weight: normal;
		}
		#lessLaborGoToDictionary-apiBody h2.in-block::before {
			content: "# ";
		}
		#lessLaborGoToDictionary-apiBody .mw-empty-elt {
			display: none;
		}
		#lessLaborGoToDictionary-apiBody a.new {
			color: #dd3333;
		}
		#lessLaborGoToDictionary-apiBody table.audiotable td,
		#lessLaborGoToDictionary-apiBody table.audiotable th {
			border: none;
		}
		#lessLaborGoToDictionary-apiBody .lessLaborGoToDictionary-play {
			display: inline-block;
			background: transparent;
			box-sizing: border-box;
			width: 0;
			height: 20px;
			border-color: transparent transparent transparent #202020;
			border-style: solid;
			border-width: 10px 0px 10px 20px;
			cursor: pointer;
			vertical-align: middle;
			margin: 2px;
		}
`;
		shadow.appendChild(style)

		linkListNode = document.createElement("div");
		linkListNode.setAttribute("id",CSS_PREFIX+"-viewer");
		shadow.appendChild(linkListNode);
		applyLinkListSize();

		coverNode = document.createElement("div");
		coverNode.setAttribute("id",CSS_PREFIX+"-cover");
		coverNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/rect30.png")+")";
		linkListNode.appendChild(coverNode);

		menuNode = document.createElement("nav");
		menuNode.setAttribute("id",CSS_PREFIX+"-menu");
		linkListNode.appendChild(menuNode);

		let linkListGridNode = document.createElement("div");
		linkListGridNode.setAttribute("id",CSS_PREFIX+"-grid");
		linkListNode.appendChild(linkListGridNode);

		containerNode = document.createElement("ul");
		containerNode.setAttribute("id",CSS_PREFIX+"-container");
		linkListGridNode.appendChild(containerNode);

		apiContentNode = document.createElement("div");
		apiContentNode.setAttribute("id",CSS_PREFIX+"-apiContent");
		linkListGridNode.appendChild(apiContentNode);

		let apiHeaderNode = document.createElement("div");
		apiHeaderNode.setAttribute("id",CSS_PREFIX+"-apiHeader");
		apiContentNode.appendChild(apiHeaderNode);

		apiSwitcheNode = document.createElement("span");
		apiSwitcheNode.setAttribute("id",CSS_PREFIX+"-apiSwitch");
		apiSwitcheNode.classList.add(CSS_PREFIX+"-checkboxButton");
		apiHeaderNode.appendChild(apiSwitcheNode);

		let apiSwitcheCircleNode = document.createElement("span");
		apiSwitcheCircleNode.classList.add(CSS_PREFIX+"-circle");
		apiSwitcheNode.appendChild(apiSwitcheCircleNode);

		let apiTitleWrapper = document.createElement("div");
		apiTitleWrapper.setAttribute("id",CSS_PREFIX+"-apiTitleWrapper");
		apiHeaderNode.appendChild(apiTitleWrapper);

		historyButtoneNode = document.createElement("div");
		historyButtoneNode.setAttribute("id",CSS_PREFIX+"-history");
		historyButtoneNode.classList.add(CSS_PREFIX+"-buttonIcon");
		historyButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/history.svg")+")";
		historyButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistory");
		apiTitleWrapper.appendChild(historyButtoneNode);

		historyDoneButtoneNode = document.createElement("div");
		historyDoneButtoneNode.setAttribute("id",CSS_PREFIX+"-historyDone");
		historyDoneButtoneNode.classList.add(CSS_PREFIX+"-buttonIcon");
		historyDoneButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/done.svg")+")";
		historyDoneButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistoryDone");
		apiTitleWrapper.appendChild(historyDoneButtoneNode);

		apiTitleNode = document.createElement("a");
		apiTitleNode.setAttribute("id",CSS_PREFIX+"-apiTitle");
		apiTitleNode.setAttribute("rel","noreferrer");
		apiTitleNode.setAttribute("target","_blank");
		apiTitleWrapper.appendChild(apiTitleNode);

		let apiNowLoadingMsgNode = document.createElement("span");
		apiNowLoadingMsgNode.setAttribute("id",CSS_PREFIX+"-nowLoadingMsg");
		apiNowLoadingMsgNode.innerText = ponyfill.i18n.getMessage("htmlNowSearching");
		apiHeaderNode.appendChild(apiNowLoadingMsgNode);

		let apiOffMsgNode = document.createElement("span");
		apiOffMsgNode.setAttribute("id",CSS_PREFIX+"-apiOffMsg");
		apiOffMsgNode.innerText = ponyfill.i18n.getMessage("htmlLinkageDisabled");
		apiHeaderNode.appendChild(apiOffMsgNode);

		let apiLoadingNode = document.createElement("div");
		apiLoadingNode.setAttribute("id",CSS_PREFIX+"-apiLoading");
		apiContentNode.appendChild(apiLoadingNode);

		let apiOffNode = document.createElement("div");
		apiOffNode.setAttribute("id",CSS_PREFIX+"-apiOff");
		apiOffNode.innerHTML = ponyfill.i18n.getMessage("htmlLinkageMessage");
		apiContentNode.appendChild(apiOffNode);

		let apiLoadingContentNode = document.createElement("div");
		apiLoadingContentNode.setAttribute("id",CSS_PREFIX+"-apiLoadingContent");
		apiLoadingContentNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/circle.svg")+")";
		apiLoadingNode.appendChild(apiLoadingContentNode);

		apiBodyNode = document.createElement("div");
		apiBodyNode.setAttribute("id",CSS_PREFIX+"-apiBody");
		apiContentNode.appendChild(apiBodyNode);

		apiFooterNode = document.createElement("div");
		apiFooterNode.setAttribute("id",CSS_PREFIX+"-apiFooter");
		apiFooterNode.innerText = FOOTER_CONTENT;
		apiContentNode.appendChild(apiFooterNode);
		clearApiContent();

		arrowNode = document.createElement("div");
		arrowNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/arrow.svg")+")";
		arrowNode.setAttribute("id", CSS_PREFIX+"-move");
		arrowNode.classList.add(CSS_PREFIX+"-buttonIcon");
		arrowNode.title = ponyfill.i18n.getMessage("htmlMove");
		menuNode.appendChild(arrowNode);

		let resizeNode = document.createElement("div");
		resizeNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/resize.svg")+")";
		resizeNode.setAttribute("id",CSS_PREFIX+"-resize");
		resizeNode.classList.add(CSS_PREFIX+"-buttonIcon");
		resizeNode.title = ponyfill.i18n.getMessage("htmlResize");
		menuNode.appendChild(resizeNode);

		let zoomDownNode = document.createElement("div");
		zoomDownNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/minus.svg")+")";
		zoomDownNode.setAttribute("id",CSS_PREFIX+"-zoomDown");
		zoomDownNode.classList.add(CSS_PREFIX+"-buttonIcon");
		zoomDownNode.title = ponyfill.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);

		let zoomUpNode = document.createElement("div");
		zoomUpNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/plus.svg")+")";
		zoomUpNode.setAttribute("id",CSS_PREFIX+"-zoomUp");
		zoomUpNode.classList.add(CSS_PREFIX+"-buttonIcon");
		zoomUpNode.title = ponyfill.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);

		let copyNode = document.createElement("div");
		copyNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/copy.svg")+")";
		copyNode.setAttribute("id",CSS_PREFIX+"-copy");
		copyNode.classList.add(CSS_PREFIX+"-buttonIcon");
		copyNode.title = ponyfill.i18n.getMessage("htmlCopy");
		menuNode.appendChild(copyNode);

		let optionNode = document.createElement("div");
		optionNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/option.svg")+")";
		optionNode.setAttribute("id",CSS_PREFIX+"-option");
		optionNode.classList.add(CSS_PREFIX+"-buttonIcon");
		optionNode.title = ponyfill.i18n.getMessage("htmloption");
		menuNode.appendChild(optionNode);
	}

	function addCommonLinkListEvents(){
		ponyfill.storage.onChanged.addListener( onStorageChanged );
		linkListNode.addEventListener("click", menuClickBihavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		document.addEventListener("mouseup", mouseupCommonBehavior);
		linkListNode.addEventListener("mousedown", mousedownCommonBehavior);
		document.addEventListener("mousedown", mousedownOuterBehavior);
		ponyfill.runtime.onMessage.addListener( notify );
		apiSwitcheNode.addEventListener("click", apiSwitchBehavior);
	}

	function addAutoLinkListEvents(){
		document.addEventListener("selectionchange", selectionChangeAutoBehavior);
		document.removeEventListener("selectionchange", manualSelectionChangeBehavior);
		document.addEventListener("mouseup", mouseupAutoBehavior);
		document.addEventListener("mousedown", mousedownAutoBehavior);
	}

	function removeAutoLinkListEvents(){
		document.removeEventListener("selectionchange", selectionChangeAutoBehavior);
		document.addEventListener("selectionchange", manualSelectionChangeBehavior);
		document.removeEventListener("mouseup", mouseupAutoBehavior);
		document.removeEventListener("mousedown", mousedownAutoBehavior);
	}

	function manualSelectionChangeBehavior(e){
		closeLinkList();
		abortApiRequestQueue();
	}

	function selectionChangeAutoBehavior(e){
		selectionChangedFlag = true;
		if(mousedownFlag) return;
		let selection = window.getSelection();
		if( selection.isCollapsed ){
			closeLinkList();
			abortApiRequestQueue();
			return;
		}
		let text = selection.toString();
		if( !checkBlank(text) ) {
			closeLinkList();
			abortApiRequestQueue();
			return;
		};
		makeLinkList(text);
		showLinkListByClick();
		if(isEnableApi()){
			abortApiRequestQueue();
			apiRequest(selection);
		}
	}

	function mousedownOuterBehavior(e){
		if( e.button != 0 ) return;
		if ( !( e.target == widgetNode && hasStpper() ) ) {
			mousedownFlag = true;
		}
	}

	function mousedownCommonBehavior(e){
		if( e.button != 0 ) return;
		if ( e.target == arrowNode ) {
			moveObj = {
				"dy": e.pageY - widgetNodeTop,
				"dx": e.pageX - widgetNodeLeft
			};
			return;
		}
	}

	function mousedownAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !isOnWidget(e.pageY, e.pageX) ) {
			closeLinkList();
			abortApiRequestQueue();
		}
	}

	function mouseupCommonBehavior(e){
		moveObj = undefined;
		mousedownFlag = false;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			Promise.resolve().then(saveLinkListSize).catch(onSaveError);
		}
	}

	function mouseupAutoBehavior(e){
		if( e.button != 0 ) return;
		if( selectionChangedFlag && !isOnWidget(e.pageY,e.pageX) ){
			let selection = window.getSelection();
			if( !selection.isCollapsed ){
				selectionChangedFlag = false;
				let text = selection.toString();
				if( !checkBlank(text) ) return;
				makeLinkList(text);
				showLinkListByClick();
				if(isEnableApi()){
					abortApiRequestQueue();
					apiRequest(selection);
				}
			}
		}
	}

	function keydownBehavior(e){
		if( e.key == "Escape" || e.key == "Esc"){
			closeLinkList();
			abortApiRequestQueue();
		}
		else if((shiftKeyFlag && e.key == "Shift")||(ctrlKeyFlag && e.key == "Control")){
			switchLinkList();
		}
	}

	function switchLinkList(){
		if(isLinkListShown() && !hasStopper()){
			closeLinkList();
			abortApiRequestQueue();
		}
		else if ( hasToShow() ) {
			let selection = window.getSelection();
			if( !selection.isCollapsed ){
				let text = selection.toString();
				if( !checkBlank(text) ) return;
				makeLinkList(selection.toString());
				showLinkListByKey();
				if(isEnableApi()) {
					abortApiRequestQueue();
					apiRequest(selection);
				}
			}
		}
	}

	function mousemoveBehavior(e){
		if ( moveObj ) {
			moveWidgetMousePonit(e);
			return;
		}
		if ( !hasStopper() && isLinkListShown() && mousedownFlag ) resizeWatcher();
	}

	function isOnWidget(yy,xx){
		if( widgetNodeTop <= yy && yy < ( widgetNodeTop + widgetNode.offsetHeight )
		&& widgetNodeLeft <= xx && xx < ( widgetNodeLeft + widgetNode.offsetWidth ) ){
			return true;
		}
		return false;
	}

	function getLinkListHeight(){
		return widgetNode.offsetHeight - ( 2 * LINK_NODE_PADDING );
	}

	function getLinkListWidth(){
		return widgetNode.offsetWidth - ( 2 * LINK_NODE_PADDING );
	}

	function resizeWatcher(){
		switchWatchFlag()
	}

	function switchWatchFlag(){
		let height = getLinkListHeight();
		let width = getLinkListWidth();
		if ( linkListNodeHeight != height || linkListNodeWidth != width ){
			resizeWatcherFlag = true;
			if ( height < LINK_NODE_MIN_HEIGHT ) height = LINK_NODE_MIN_HEIGHT;
			if ( width < LINK_NODE_MIN_WIDTH ) width = LINK_NODE_MIN_WIDTH;
			linkListNodeHeight = height;
			linkListNodeWidth = width;
		}
	}

	function applyFaviconDisplay(res){
		if( res == LINK_LIST_FAVICON_ONLY ) {
			linkListNode.classList.add(CSS_PREFIX+"-mini");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-mini");
		}
	}

	function applyLinknListDirection(res){
		if( res == LINK_LIST_DIRECTION_HORIZAONTAL ) {
			linkListNode.classList.add(CSS_PREFIX+"-inline");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-inline");
		}
	}

	function applyLinknListSeparator(res){
		if( res == LINK_LIST_SEPARATOR_VERTICAL ) {
			linkListNode.classList.add(CSS_PREFIX+"-separator");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-separator");
		}
	}

	function applyServiceCode(res){
		if( res == API_SERVICE_CODE_NONE ) {
			hide(apiContentNode);
		}
		else {
			show(apiContentNode);
		}
	}

	function saveLinkListSize(){
		return ponyfill.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": linkListNodeHeight,
				"lw": linkListNodeWidth
			}
		});
	}

	function closeLinkList(){
		resetScrollTmp();
		hide(widgetNode);
	}

	function closeLinkListDelay(){
		window.setTimeout(closeLinkList, LINK_LIST_CLOSE_TIME);
	}

	function onClickAnchor(e){
		closeLinkListDelay();
		abortApiRequestQueue();
	}

	function onClickSaveHistory(e){
		saveHistory(e.currentTarget.getAttribute("data-text"), window.location.toString(), document.title.toString(), e.currentTarget.getAttribute("data-url"), e.currentTarget.getAttribute("data-label")).catch(onSaveError);
	}

	function saveHistory(text,fromURL,fromTitle,toURL,toTitle,asIs=false){
		let data = {
			"method": "saveHistory",
			"data": {
				"text": text,
				"fromURL": fromURL,
				"fromTitle": fromTitle,
				"toURL": toURL,
				"toTitle": toTitle,
				"asIs": asIs
			}
		};
		return ponyfill.runtime.sendMessage(data);
	}

	function makeLinkList(text){
		let list = containerNode.querySelectorAll("."+CSS_PREFIX+"-list");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			containerNode.removeChild(node);
		}
		clearApiContent();
		for(let i=0; i<optionList.length; i++){
			let item = optionList[i];
			let li = document.createElement("li");
			li.classList.add(CSS_PREFIX+"-list");
			li.setAttribute( "title", item["l"] );
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(text) );
			let a = document.createElement("a");
			a.classList.add(CSS_PREFIX+"-anchor");
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.setAttribute( "rel", "noreferrer" );
			a.setAttribute( "data-text", text );
			a.setAttribute( "data-url", item["u"] );
			a.setAttribute( "data-label", item["l"] );
			a.addEventListener("click", onClickAnchor);
			if( item["h"] ) a.addEventListener("click", onClickSaveHistory);
			let img = document.createElement("img");
			img.classList.add(CSS_PREFIX+"-favicon");
			let src;
			if( faviconCache.hasOwnProperty(item["u"]) ){
				src = faviconCache[item["u"]];
			}
			else {
				src = ponyfill.extension.getURL("/image/favicon.svg");
			}
			img.setAttribute( "src", src );
			setFaviconSize(img, anchorSize);
			a.appendChild(img);
			let span = document.createElement("span");
			span.classList.add(CSS_PREFIX+"-label");
			setFontSize(span, anchorSize);
			span.innerText = item["l"];
			a.appendChild(span);
			li.appendChild(a);
			containerNode.appendChild(li);
		}
	}

	function applyLinkListSize(){
		resizeWidget(linkListNodeHeight, linkListNodeWidth)
	}

	function resizeWidget(height, width){
		widgetNode.style.height = height + "px";
		widgetNode.style.width = width + "px";
	}

	function showLinkListByClick(){
		if( linkListAction == LINK_LIST_ACTION_MOUSECLICK || linkListAction == LINK_LIST_ACTION_MOUSEOVER ) addStopper();
		showLinkList();
	}

	function showLinkListByKey(){
		removeStopper();
		showLinkList();
	}

	function getSelectionRect(){
		let selection = window.getSelection();
		let lastRange = selection.getRangeAt(selection.rangeCount-1);
		let rectList = lastRange.getClientRects();
		let rect = rectList[rectList.length-1];
		return rect;
	}

	function showLinkList(){
		show(widgetNode);
		applyLinkListSize();
		let rect = getSelectionRect();
		widgetNodeLeft = makeWidgetPointX(rect);
		widgetNodeTop = makeWidgetPointY(rect);
		moveWidget();
		scrollWidget(0,0);
	}

	function makeWidgetPointX(rect){
		let clientX = rect.right;
		let pageX = window.scrollX + clientX;
		let viewPortWidth = window.innerWidth - SCROLL_SPACE;
		if ( viewPortWidth < linkListNode.offsetWidth ){
			return window.scrollX;
		}
		if ( (clientX + linkListNode.offsetWidth + RECT_SPACE) <= viewPortWidth){
			return pageX + RECT_SPACE;
		}
		return window.scrollX + viewPortWidth - linkListNode.offsetWidth;
	}

	function makeWidgetPointY(rect){
		let clientY = rect.bottom;
		let pageY = window.scrollY + clientY;
		let viewPortHeight = window.innerHeight - SCROLL_SPACE;
		if ( viewPortHeight < linkListNode.offsetHeight ){
			return pageY + RECT_SPACE;
		}
		if ( (clientY + RECT_SPACE + linkListNode.offsetHeight) <=  viewPortHeight ){
			return pageY + RECT_SPACE;
		}
		yy = rect.top - linkListNode.offsetHeight - RECT_SPACE;
		if ( 0 <= yy) {
			return window.scrollY + yy;
		}
		return pageY + RECT_SPACE;
	}

	function isLinkListShown(){
		return !linkListNode.classList.contains(CSS_PREFIX+"-hide");
	}

	function onStorageChanged(change, area){
		if( change["lh"] || change["lw"] ){
			let lh = linkListNodeHeight;
			if( change.hasOwnProperty("lh") ) lh = change["lh"]["newValue"];
			let lw = linkListNodeWidth;
			if( change.hasOwnProperty("lw") ) lw = change["lw"]["newValue"];
			setLinkListSize( lh, lw );
		}
		if( change["as"] ){
			setAnchorSize( change["as"]["newValue"] );
		}
		if( change["ck"] ){
			setCtrlKeyFlag( change["ck"]["newValue"] );
		}
		if( change["sk"] ){
			setShiftKeyFlag( change["sk"]["newValue"] );
		}
		if( change["ol"] ) {
			closeLinkList();
			abortApiRequestQueue();
			setOptionList( change["ol"]["newValue"] );
			resetLinkListEvents();
			if(hasLinkList()) getFavicon().then( gotFavicon ).catch((e)=>{console.error(e);});
		}
		if( change["bf"] ){
			closeLinkList();
			abortApiRequestQueue();
			setLinkListFlag( change["bf"]["newValue"] );
			resetLinkListEvents();
		}
		if( change["cl"] ){
			setLinkListStyle( change["cl"]["newValue"] );
		}
		if( change["ca"] ){
			setLinkListAction( change["ca"]["newValue"] );
		}
		if( change["f"] ){
			applyFaviconDisplay( change["f"]["newValue"] );
		}
		if( change["ld"] ){
			applyLinknListDirection( change["ld"]["newValue"] );
		}
		if( change["ls"] ){
			applyLinknListSeparator( change["ls"]["newValue"] );
		}
		if( change["s"] ){
			closeLinkList();
			abortApiRequestQueue();
			setServiceCode( change["s"]["newValue"] );
			applyServiceCode( change["s"]["newValue"] );
		}
		if( change["ll"] ){
			setLanguageFilter( change["ll"]["newValue"] );
		}
		if( change["co"] ){
			setLinkListApiCutOut( change["co"]["newValue"] );
		}
		if(!change.hasOwnProperty("w")) return;
		if(change["w"]["newValue"] == windowId) return;
		if( change["sw"] ){
			closeLinkList();
			abortApiRequestQueue();
			setApiSwitch( change["sw"]["newValue"] );
		}
	}

	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		if( isLinkListShown() ) applyLinkListSize();
	}

	function loadSetting(){
		let serviceCode = getDefaultServiceCode();
		let languageFilter = getDefaultLanguageFilter();
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE,
			"cl": LINK_LIST_STYLE_DARK,
			"ca": LINK_LIST_ACTION_MOUSECLICK,
			"f": LINK_LIST_FAVICON_ONLY,
			"ld": LINK_LIST_DIRECTION_VERTICAL,
			"ls": LINK_LIST_SEPARATOR_VERTICAL,
			"sw": API_SWITCH_DISABLED,
			"s": serviceCode,
			"ll": languageFilter,
			"co": true
		});
		return getter.then(setVer, onReadError);
	}

	function setVer( res ){
		setAnchorSize( res["as"] );
		setLinkListSize( res["lh"], res["lw"] );
		setOptionList( res["ol"] );
		setLinkListFlag( res["bf"] );
		setCtrlKeyFlag( res["ck"] );
		setShiftKeyFlag( res["sk"] );
		setLinkListStyle( res["cl"] );
		setLinkListAction( res["ca"] );
		applyFaviconDisplay( res["f"] );
		applyLinknListDirection( res["ld"] );
		applyLinknListSeparator( res["ls"] );
		setApiSwitch( res["sw"] );
		setServiceCode( res["s"] );
		applyServiceCode( res["s"] );
		setLanguageFilter( res["ll"] );
		setLinkListApiCutOut( res["co"] );
		resetLinkListEvents();
		if(hasLinkList()) getFavicon().then( gotFavicon ).catch((e)=>{console.error(e);});
	}

	function setAnchorSize(res){
		anchorSize = res;
		applyZoomLinkList();
	}

	function setLinkListFlag(res){
		linkListFlag = res;
	}

	function setShiftKeyFlag(res){
		shiftKeyFlag = res;
	}

	function setCtrlKeyFlag(res){
		ctrlKeyFlag = res;
	}

	function setServiceCode(res){
		serviceCode = res;
	}

	function setLanguageFilter(res){
		languageFilter = res;
	}

	function setLinkListApiCutOut(res){
		apiCutOut = res;
	}

	function setLinkListStyle(res){
		widgetNode.classList.remove(CSS_PREFIX+"-dark");
		linkListNode.classList.remove(CSS_PREFIX+"-dark");
		if( res == LINK_LIST_STYLE_DARK ) {
			widgetNode.classList.add(CSS_PREFIX+"-dark");
			linkListNode.classList.add(CSS_PREFIX+"-dark");
		}
	}

	function setLinkListAction(res){
		linkListAction = res;
		resetScrollTmp();
		linkListNode.classList.remove(CSS_PREFIX+"-mouseover");
		linkListNode.classList.remove(CSS_PREFIX+"-mouseclick");
		removeStopper();
		linkListNode.removeEventListener("mouseenter", removeStopper);
		linkListNode.removeEventListener("mouseleave", controlStopper);
		coverNode.removeEventListener("click", widgetActionMouseclick);
		if( linkListAction == LINK_LIST_ACTION_MOUSEOVER ){
			linkListNode.classList.add(CSS_PREFIX+"-mouseover");
			addStopper();
			linkListNode.addEventListener("mouseenter", removeStopper);
			linkListNode.addEventListener("mouseleave", controlStopper);
		}
		else if( linkListAction == LINK_LIST_ACTION_MOUSECLICK ) {
			linkListNode.classList.add(CSS_PREFIX+"-mouseclick");
			addStopper();
			coverNode.addEventListener("click", widgetActionMouseclick);
		}
	}

	function widgetActionMouseclick(e){
		removeStopper();
		let rect = getSelectionRect();
		widgetNodeLeft = makeWidgetPointX(rect);
		widgetNodeTop = makeWidgetPointY(rect);
		moveWidget();
	}

	function controlStopper(e){
		if(!resizeWatcherFlag){
			addStopper();
			widgetScrollTopTmp = widgetNode.scrollTop;
			widgetScrollleftTmp = widgetNode.scrollLeft;
			scrollWidget(0,0);
		}
	}

	function addStopper(){
		widgetNode.classList.add(CSS_PREFIX+"-stopper");
		linkListNode.classList.add(CSS_PREFIX+"-stopper");
	}

	function removeStopper(e){
		if(!hasStopper())return;
		scrollWidget(widgetScrollTopTmp, widgetScrollleftTmp);
		linkListNode.classList.remove(CSS_PREFIX+"-stopper");
		widgetNode.classList.remove(CSS_PREFIX+"-stopper");
	}

	function hasStopper(){
		return linkListNode.classList.contains(CSS_PREFIX+"-stopper");
	}

	function resetScrollTmp(){
		widgetScrollTopTmp = widgetScrollleftTmp = 0;
	}

	function resetLinkListEvents(){
		removeAutoLinkListEvents();
		if( linkListFlag && hasToShow() ) addAutoLinkListEvents();
	}

	function setOptionList(res){
		optionList = [];
		for(let i=0; i<res.length; i++){
			let data = res[i];
			if ( data["c"] ) optionList.push(data);
		}
	}

	function getFavicon(){
		return ponyfill.runtime.sendMessage({
			"method": "getFavicon",
		});
	}

	function gotFavicon(e){
		faviconCache = e;
	}

	function hasToShow(){
		return (hasLinkList() || hasServiceCode());
	}

	function hasLinkList(){
		if( optionList.length > 0 ) return true;
		return false;
	}

	function hasServiceCode(){
		return (serviceCode != API_SERVICE_CODE_NONE);
	}

	function menuClickBihavior(e){
		let id = e.target.getAttribute("id");
		if(id == CSS_PREFIX+"-history"){
			hide(historyButtoneNode);
			show(historyDoneButtoneNode);
			Promise.resolve().then(saveHistoryWiktionaryLinkage).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-zoomUp"){
			if( zoomLinkList(1) ) Promise.resolve().then(saveAnchorSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-zoomDown"){
			if( zoomLinkList(-1) ) Promise.resolve().then(saveAnchorSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-copy"){
			Promise.resolve().then(copyText).then(closeLinkList).then(abortApiRequestQueue).catch(unexpectedError);
		}
		else if(id == CSS_PREFIX+"-resize"){
			resetSize(LINK_NODE_DEFAULT_HEIGHT, LINK_NODE_DEFAULT_WIDTH);
			Promise.resolve().then(saveLinkListSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-option"){
			ponyfill.runtime.sendMessage({"method": "openOptions"}).then(closeLinkList).then(abortApiRequestQueue).catch(unexpectedError);
		}
	}

	function copyText(){
		document.execCommand("copy");
		return ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationCopyed")
		});
	}

	function resetSize(height,width){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		applyLinkListSize();
	}

	function zoomLinkList(direction=1){
		if ( direction < 0 && anchorSize <= ANCHOR_MIN_SIZE ) return false;
		if ( 0 < direction && ANCHOR_MAX_SIZE <= anchorSize ) return false;
		anchorSize += direction * ANCHOR_RESIO;
		anchorSize = truncNumber(anchorSize);
		applyZoomLinkList();
		return true;
	}

	function truncNumber(num){
		num += 0.01;
		num *= 10 ;
		num = Math.floor(num);
		num /= 10 ;
		return num
	}

	function applyZoomLinkList(){
		let list = linkListNode.querySelectorAll("span."+CSS_PREFIX+"-label");
		for(let i=0; i<list.length; i++){
			setFontSize(list[i], anchorSize);
		}
		list = linkListNode.querySelectorAll("img."+CSS_PREFIX+"-favicon");
		for(let i=0; i<list.length; i++){
			setFaviconSize(list[i], anchorSize);
		}
	}

	function setFontSize(node, size){
		node.style["font-size"] = size + "em";
	}

	function setFaviconSize(node, size){
		size = truncNumber(size + (2*ANCHOR_RESIO));
		node.style["height"] = size + "em";
		node.style["width"] = size + "em";
	}

	function saveAnchorSize(){
		let res = ponyfill.runtime.sendMessage({
			"method": "saveAnchorSize",
			"data": {
				"as": anchorSize
			}
		});
		return res;
	}

	function onSaveError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationSaveOptionError", [e.message])
		});
		return res;
	}

	function onReadError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationReadOptionError", [e.message])
		});
		return res;
	}

	function unexpectedError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationUnexpectedError", [e.message])
		});
		return res;
	}

	function onAudioPlayError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationAudioPlayError", [e.message])
		});
		return res;
	}

	function silentError(e){
		if( e.message.match( SILENT_ERROR_REGEX ) ){
			console.log(e);
		}
		else {
			throw(e);
		}
	}

	function notify(e){
		if(e.method == "updateFaviconCache") {
			faviconCache = e.data;
		}
	}

	function apiRequest(selection){
		let text = selection.toString().replace(REMOVE_SPACE_REGEX," ").trim();
		let id = fetchRequestID();
		let obj = {
			"id": id,
			"abort": false,
			"data": {
				"text": text,
				"api": "wiktionary"
			}
		};
		apiRequestQueue[id] = obj;
		if( !checkBlank(text) ){
			obj.data.error = API_WHITE_SPACE_ERROR;
			return apiResponseError.bind(obj)(obj.data);
		}
		if( !checkByte(text, API_TEXT_MAX_LENGTH) ){
			obj.data.error = API_TEXT_MAX_LENGTH_ERROR;
			return apiResponseError.bind(obj)(obj.data);
		}
		let keyList = Object.keys(apiRequestQueue);
		if(keyList.length<=1) {
			clearApiContent();
			apiRequestStart(obj);
			return;
		}
		setTimeout((e)=>{
			if( !isActiveApiRequestQueue(obj) ){
				dropApiRequestQueue(obj);
				return;
			}
			apiRequestStart(obj);
		}, API_QUERY_DERAY);
	}

	function apiRequestStart(obj){
		ponyfill.runtime.sendMessage({
			"method": "apiRequest",
			"data": obj.data
		}).then(
			apiResponse.bind(obj)
		).catch(
			apiResponseError.bind(obj)
		).finally(
			()=>{
				dropApiRequestQueue(obj)
			}
		).catch((e)=>{ console.error(e) });
	}

	function isActiveApiRequestQueue(obj){
		return ( apiRequestQueue.hasOwnProperty(obj.id) && !obj.abort );
	}

	function dropApiRequestQueue(obj){
		delete apiRequestQueue[obj.id];
	}

	function abortApiRequestQueue(){
		let valueList = Object.values(apiRequestQueue);
		for(let i=0; i<valueList.length; i++){
			valueList[i].abort = true;
		}
	}

	function clearApiContent(){
		linkListNode.classList.add(CSS_PREFIX+"-loading");
		hide(historyButtoneNode);
		hide(historyDoneButtoneNode);
		clearChildren(apiBodyNode);
	}

	function clearChildren(node){
		while(node.lastChild){
			node.removeChild(node.lastChild);
		}
	}

	function apiResponse(e){
		if( !isActiveApiRequestQueue(this) ) return;
		if( e.hasOwnProperty("error") ) return apiResponseError.bind(this)(e);
		if( e.text.toLowerCase() != e.title.toLowerCase() ) {
			apiTitleNode.innerText = ponyfill.i18n.getMessage("htmlMaybeTitle",[e.title]);
		}
		else {
			apiTitleNode.innerText = e.title;
		}
		apiTitleNode.setAttribute("data-text", e.text);
		apiTitleNode.setAttribute("data-title", e.title);
		apiTitleNode.setAttribute("href", e.fullurl);
		let sections = [];
		if(languageFilter.length > 0){
			let followed = API_SERVICE_PROPERTY[e.service].followed;
			let regex = new RegExp("\\s+"+followed+"$","i");
			for(let i=0; i<e.html.length; i++){
				let div = document.createElement("div");
				div.innerHTML = e.html[i];
				for(let j=0; j<languageFilter.length; j++){
					let language = languageFilter[j];
					if (followed != null) language = language.replace(regex, "");
					let list = div.querySelectorAll(".section-heading");
					for(let k=0; k<list.length; k++){
						let target = list[k];
						if(language!=target.innerText) continue;
						let tmp = [];
						tmp.push(target);
						while( target.nextElementSibling && !target.nextElementSibling.classList.contains("section-heading") ){
							tmp.push( target.nextElementSibling );
							target = target.nextElementSibling;
						}
						let div2 = document.createElement("div");
						for(let l=0; l<tmp.length; l++ ){
							div2.appendChild(tmp[l]);
						}
						sections.push(div2);
						break;
					}
				}
			}
			if(sections.length<=0){
				e.error = SECTION_NOT_FOUND_ERROR;
				return apiResponseError.bind(this)(e);
			}
		}
		else {
			for(let i=0; i<e.html.length; i++){
				let div = document.createElement("div");
				div.innerHTML = e.html[i];
				sections.push(div);
			}
		}
		for(let i=0; i<sections.length; i++){
			let doc = sections[i];
			let content;
			let list;
			if(apiCutOut){
				let olList = doc.querySelectorAll("ol");
				if (olList.length<=0) {
					e.error = MEANING_NOT_FOUND_ERROR;
					return apiResponseError.bind(this)(e);
				}
				for(let i=0; i<olList.length; i++){
					if( checkBlank(olList[i].innerText) ) {
						content = olList[i];
						break;
					}
				}
				if(!content){
					e.error = MEANING_NOT_FOUND_ERROR;
					return apiResponseError.bind(this)(e);
				}
			}
			else {
				content = doc;
				list = content.querySelectorAll("h1.in-block,h2.in-block,h3.in-block,h4.in-block,h5.in-block,h6.in-block");
				let reduceSections = API_SERVICE_PROPERTY[e.service].reduceSection;
				for(let i=0; i<list.length; i++){
					let node = list[i];
					for(let j=0; j<reduceSections.length; j++ ){
						if( !node.innerText.match(reduceSections[j]) ) continue;
						while(node.nextElementSibling && !node.nextElementSibling.classList.contains("in-block")){
							node.nextElementSibling.remove();
						}
						node.remove();
						break;
					}
				}
			}
			list = content.querySelectorAll(".indicator,.noprint,.NavFrame,ol>li>dl,ol>li>ul,hr");
			for(let i=0; i<list.length; i++){
				list[i].parentNode.removeChild(list[i]);
			}
			list = content.querySelectorAll("[style]");
			for(let i=0; i<list.length; i++){
				list[i].style.float = "none";
				if( list[i].style.width ) list[i].style.width = "auto";
			}
			list = content.querySelectorAll("audio");
			for(let i=0; i<list.length; i++){
				let audio = list[i];
				audio.style.display = "none";
				let playButton = document.createElement("span");
				playButton.classList.add(CSS_PREFIX+"-play");
				if(audio.nextElementSibling){
					audio.nextElementSiblin.insertBefore(playButton);
				}
				else{
					audio.parentNode.appendChild(playButton);
				}
				playButton.addEventListener("click",(e)=>{
					let url = audio.currentSrc;
					if(!url){
						let list = audio.querySelectorAll("source");
						for(let i=list.length-1; 0<=i; i--){
							url = list[i].src;
							if( url.match("ogg$") ) break;
						}
					}
					if(!url) return onAudioPlayError( new Error("Audio source not found.") );
					url = fullSSLURL(url);
					let p = ponyfill.runtime.sendMessage({
						"method": "downloadAsBaase64",
						"data": {
							"url": url
						}
					});
					p.catch( (e)=>{ return onAudioPlayError(e); });
				});
			}
			list = content.querySelectorAll("a[href]:not([href^=http])");
			for(let i=0; i<list.length; i++){
				let url = list[i].getAttribute("href");
				list[i].setAttribute("href", e.service + url);
			}
			list = content.querySelectorAll("a");
			for(let i=0; i<list.length; i++){
				list[i].setAttribute("target", "_blank");
				list[i].setAttribute("rel", "noreferrer");
			}
			apiBodyNode.appendChild(content);
		}
		show(historyButtoneNode);
		linkListNode.classList.remove(CSS_PREFIX+"-loading");
	}

	function fullSSLURL(url){
		if( url.match("^//") ){
			return "https:" + url;
		}
		if( url.match(/^http:/) ){
			return url.replace(/^http:/, "https:");
		}
		if( url.match("^/") ){
			return "https:/" + url;
		}
		return url;
	}

	function apiResponseError(e){
		if(!isActiveApiRequestQueue(this)) return;

		function after(content){
			apiBodyNode.appendChild(content);
			linkListNode.classList.remove(CSS_PREFIX+"-loading");
		}

		let content = document.createElement("div");
		if(e && ( e instanceof Object) && e.hasOwnProperty("error")){
			if( e.error == API_WHITE_SPACE_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "White space limitation";
				content.innerText = ponyfill.i18n.getMessage("htmlWhiteSpaceLimitation");
				after(content);
				return;
			}
			if( e.error == API_TEXT_MAX_LENGTH_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "Max length limitation";
				content.innerText = ponyfill.i18n.getMessage("htmlMaxLengthLimitation",[API_TEXT_MAX_LENGTH]);
				after(content);
				return;
			}
			if( e.error == MEANING_NOT_FOUND_ERROR ){
				apiTitleNode.setAttribute("href", e.fullurl);
				content.innerText = ponyfill.i18n.getMessage("htmlMeaningNotFound");
				after(content);
				return;
			}
			if( e.error == SECTION_NOT_FOUND_ERROR ){
				apiTitleNode.setAttribute("href", e.fullurl);
				content.innerText = ponyfill.i18n.getMessage("htmlSectionNotFound");
				after(content);
				return;
			}
			if( e.error == PAGE_NOT_FOUND_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "Page not found";
				content.innerText = ponyfill.i18n.getMessage("htmlPageNotFound");
				after(content);
				return;
			}
			else if( e.error == CONNECTION_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "Connection error";
				content.innerText = ponyfill.i18n.getMessage("htmlConnectionError",[e.code]);
				after(content);
				return;
			}
			else if( e.error == SERVER_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "Server error";
				content.innerText = ponyfill.i18n.getMessage("htmlServerError",[e.code]);
				after(content);
				return;
			}
			else if( e.error == APPLICATION_ERROR ){
				apiTitleNode.removeAttribute("href");
				apiTitleNode.innerText = "Application error";
				content.innerText = ponyfill.i18n.getMessage("htmlApplicationError",[e.code]);
				after(content);
				return;
			}
		}
		apiTitleNode.removeAttribute("href");
		apiTitleNode.innerText = "Unexpected error";
		content.innerText = ponyfill.i18n.getMessage("htmlUnexpectedError",[e.toString()]);
		after(content);
		return;
	}

	function show(node){
		node.classList.remove(CSS_PREFIX+"-hide");
	}

	function hide(node){
		node.classList.add(CSS_PREFIX+"-hide");
	}

	function apiSwitchBehavior(e){
		if(apiSwitcheNode.getAttribute("data-checked") != API_SWITCH_ENABLED){
			setApiSwitch(API_SWITCH_ENABLED);
			saveApiSwitch(API_SWITCH_ENABLED).catch( onSaveError );
			apiRequest(window.getSelection());
		}
		else {
			setApiSwitch(API_SWITCH_DISABLED);
			saveApiSwitch(API_SWITCH_DISABLED).catch( onSaveError );
		}
	}

	function setApiSwitch(value){
		if(value != API_SWITCH_ENABLED){
			apiSwitcheNode.removeAttribute("data-checked");
			linkListNode.classList.add(CSS_PREFIX+"-apiDisabled");
		}
		else {
			apiSwitcheNode.setAttribute("data-checked", API_SWITCH_ENABLED);
			linkListNode.classList.remove(CSS_PREFIX+"-apiDisabled");
		}
	}

	function isApiSwitchOn(){
		return ( apiSwitcheNode.getAttribute("data-checked") == API_SWITCH_ENABLED );
	}

	function saveApiSwitch(value){
		windowId = Math.random();
		return ponyfill.runtime.sendMessage({
			"method": "saveApiSwitch",
			"data": {
				"w": windowId,
				"sw": value
			}
		});
	}

	function isEnableApi(){
		return ( hasServiceCode() && isApiSwitchOn() );
	}

	function moveWidgetMousePonit(e){
		widgetNodeTop = e.pageY - moveObj.dy;
		widgetNodeLeft = e.pageX - moveObj.dx;
		moveWidget();
	}

	function moveWidget(){
		widgetNode.style.top = widgetNodeTop+"px";
		widgetNode.style.left = widgetNodeLeft+"px";
	}

	function scrollWidget(top, left){
		widgetNode.scrollTop = top;
		widgetNode.scrollLeft = left;
	}

	function saveHistoryWiktionaryLinkage(){
		return saveHistory(
			apiTitleNode.getAttribute("data-text"),
			window.location.toString(),
			document.title.toString(),
			apiTitleNode.href,
			apiTitleNode.getAttribute("data-title"),
			true
		).catch(onSaveError);
	}

})();
