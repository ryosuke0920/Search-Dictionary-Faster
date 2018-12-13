const CSS_PREFIX = "lessLaborGoToDictionary";
const LINK_NODE_PADDING = 0;
/* cl */
const LINK_LIST_STYLE_CLASSIC = "c";
const LINK_LIST_STYLE_DARK = "d";
/* f */
const LINK_LIST_FAVICON_NORMAL = "n";
const LINK_LIST_FAVICON_ONLY = "o";
/* ld */
const LINK_LIST_DIRECTION_VERTICAL = "v";
const LINK_LIST_DIRECTION_HORIZAONTAL = "h";
/* ls */
const LINK_LIST_SEPARATOR_VERTICAL = "v";
const LINK_LIST_SEPARATOR_HORIZONTAL = "h";
/* ca */
const LINK_LIST_ACTION_NORMAL = "n";
const LINK_LIST_ACTION_MOUSEOVER = "m";
const LINK_LIST_ACTION_MOUSECLICK = "c";

const DOMAIN_MAX_LENGTH = 253;
const DOMAIN_LIST_MAX_SIZE = 50;

const DEFAULT_AUTO_VIEW_FLAG = true;
const DEFAULT_SHIFT_KEY_VIEW_FLAG = false;
const DEFAULT_CTRL_KEY_VIEW_FLAG = false;
const DEFAULT_ENABLE_VALUE = "1";
const DEFAULT_OPTION_LIST_ON_GET = [];
const DEFAULT_DOMAIN_LIST = [];
const DEFAULT_MEANING_VALUE = false;
const LINK_LIST_DEFAULT_STYLE = LINK_LIST_STYLE_CLASSIC;

const DEFAULT_LOCALE = "en";

const FOOTER_CONTENT = "Provided by Wiktionary under Creative Commons Attribution-Share Alike 3.0; additional terms may apply.";//https://www.mediawiki.org/wiki/API:Licensing
const FOOTER_CONTENT2 = "Provided by Wikipedia under Creative Commons Attribution-Share Alike 3.0; additional terms may apply.";//https://www.mediawiki.org/wiki/API:Licensing

const API_SWITCH_DISABLED = "";
const API_SWITCH_ENABLED = "1";
const API_SERVICE_CODE_NONE = "-";
const API_SERVICE_NONE = null;
const API_SERVICE = {
	"de": "https://de.wiktionary.org",
	"en": "https://en.wiktionary.org",
	"fr": "https://fr.wiktionary.org",
	"ja": "https://ja.wiktionary.org",
	"ru": "https://ru.wiktionary.org",
	"zh": "https://zh.wiktionary.org",
	"w-de": "https://de.wikipedia.org",
	"w-en": "https://en.wikipedia.org",
	"w-fr": "https://fr.wikipedia.org",
	"w-ja": "https://ja.wikipedia.org",
	"w-ru": "https://ru.wikipedia.org",
	"w-zh": "https://zh.wikipedia.org"
};
const API_SERVICE_PROPERTY = {
	"https://de.wiktionary.org":{
		"defaultLanguage": ["Deutsch","Englisch"],
		"namespace":"Kategorie",
		"langCat": "Kategorie:Sprachen",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":".+\\(",
		"languageBottomRegex":"\\)$",
		"cutOut": "Bedeutungen:",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://en.wiktionary.org":{
		"defaultLanguage": ["English language"],
		"namespace":"Category",
		"langCat": "Category:All_languages",
		"sectionHeading": "h2.in-block",
		"followed": "language","//":"https://en.wiktionary.org/wiki/Wiktionary:Languages#Finding_and_organising_terms_in_a_language",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://fr.wiktionary.org":{
		"defaultLanguage": ["français","anglais"],
		"namespace":"Catégorie",
		"langCat": "Catégorie:Langues",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://ja.wiktionary.org":{
		"defaultLanguage": ["日本語","英語"],
		"namespace":"カテゴリ",
		"langCat": "カテゴリ:言語",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://ru.wiktionary.org":{
		"defaultLanguage": ["Русский язык","Английский язык"],
		"namespace":"Категория",
		"langCat": "Категория:Алфавитный_список_языков",
		"sectionHeading": "h1.in-block",
		"followed": "язык",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://zh.wiktionary.org":{
		"defaultLanguage": ["汉语","英语"],
		"namespace":"Category",
		"langCat": "分类:所有语言",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":false,
		"path": "/w/api.php"
	},
	"https://de.wikipedia.org":{
		"path": "/w/api.php"
	},
	"https://en.wikipedia.org":{
		"path": "/w/api.php"
	},
	"https://fr.wikipedia.org":{
		"path": "/w/api.php"
	},
	"https://ja.wikipedia.org":{
		"path": "/w/api.php"
	},
	"https://ru.wikipedia.org":{
		"path": "/w/api.php"
	},
	"https://zh.wikipedia.org":{
		"path": "/w/api.php"
	}
};
const PAGE_NOT_FOUND_ERROR = "page not found";
const CONNECTION_ERROR = "connection error";
const SERVER_ERROR = "server error";
const APPLICATION_ERROR = "application error";
const HTTP_NG = "0";
const HTTP_200_OK = "200";
const HTTP_206_PARTIAL = "206";

const WIDGET_STYLE = `
* {
	padding: 0;
	margin: 0;
}
#lessLaborGoToDictionary-widget {
	background-color: #F0F0F0;
	display: block;
	position: absolute;
	z-index: 2147483646;
	box-shadow: 0 0 2px black;
	overflow: auto;
	resize: both;
	user-select: none;
	-moz-user-select: none;
	font-family: sans-serif;
	font-size: 1em;
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-hide {
	display: none;
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-dark {
	background-color: #202020;
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-stopper {
	width: 30px !important;
	height: 30px !important;
	padding: 0px !important;
	overflow: hidden;
	resize: none;
	background: none;
	background-color: transparent;
	box-shadow: none;
}
#lessLaborGoToDictionary-cover {
	display: none;
	cursor: pointer;
	width: 30px;
	height: 30px;
	position: absolute;
	top: 0;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-cover {
	display: block;
}
#lessLaborGoToDictionary-menu {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	white-space: nowrap;
	padding: 3px;
	height: 26px;
}
.lessLaborGoToDictionary-dark #lessLaborGoToDictionary-menu {
	background: linear-gradient(#404040, #202020);
}
#lessLaborGoToDictionary-menu > * {
	margin-right: 3px;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-menu {
	display: none;
}
.lessLaborGoToDictionary-buttonIcon {
	display: inline-block;
	height: 20px;
	min-height: 20px;
	width: 20px;
	min-width: 20px;
	cursor: pointer;
	background-size: cover;
	user-select: none;
	-moz-user-select: none;
}
.lessLaborGoToDictionary-textButton {
	display: none;
	color: #808080;
	font-weight: bold;
	cursor: pointer;
}
.lessLaborGoToDictionary-enableWiktionary #lessLaborGoToDictionary-wiktionaryButton,
.lessLaborGoToDictionary-enableWikipedia #lessLaborGoToDictionary-wikipediaButton {
	display: inline;
}
.lessLaborGoToDictionary-selectWiktionary #lessLaborGoToDictionary-wiktionaryButton,
.lessLaborGoToDictionary-selectWikipedia #lessLaborGoToDictionary-wikipediaButton {
	border-bottom: solid 2px #808080;
}
#lessLaborGoToDictionary-move {
	cursor: move;
}
#lessLaborGoToDictionary-grid {
	border-top: solid 1px #808080;
}
.lessLaborGoToDictionary-separator #lessLaborGoToDictionary-grid {
	display: grid;
	grid-template-columns: min-content minmax(200px,auto);
	grid-template-rows: min-content 1fr;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-grid {
	display: none;
}
#lessLaborGoToDictionary-footer {
	display: none;
	border-top: solid 1px #808080;
	background: linear-gradient(#FFFFFF, #F0F0F0);
	color: #808080;
	font-size: 0.8em;
	padding: 3px;
}
.lessLaborGoToDictionary-enableWiktionary #lessLaborGoToDictionary-footer,
.lessLaborGoToDictionary-enableWikipedia #lessLaborGoToDictionary-footer {
	display: block;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-footer {
	display: none;
}
.lessLaborGoToDictionary-dark #lessLaborGoToDictionary-footer {
	background: linear-gradient(#404040, #202020);
}
#lessLaborGoToDictionary-container {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	padding: 3px;
}
.lessLaborGoToDictionary-dark #lessLaborGoToDictionary-container {
	background: linear-gradient(#404040, #202020);
}
.lessLaborGoToDictionary-list {
	display: block;
	white-space: nowrap;
}
.lessLaborGoToDictionary-inline .lessLaborGoToDictionary-list {
	display: inline;
	white-space: normal;
	margin-right: 3px;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list {
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list:hover {
	background-color:#505050;
}
.lessLaborGoToDictionary-anchor {
	display: block;
	text-decoration: none;
}
.lessLaborGoToDictionary-inline .lessLaborGoToDictionary-anchor {
	display: inline;
}
.lessLaborGoToDictionary-anchor:hover {
	text-decoration: underline;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor {
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
	width: 16px;
	height: 16px;
}
.lessLaborGoToDictionary-label {
	cursor: pointer;
	margin-left: 5px;
}
.lessLaborGoToDictionary-mini .lessLaborGoToDictionary-label {
	display: none;
}
#lessLaborGoToDictionary-apiContent {
	display: none;
	border-top: solid 1px #808080;
	position: relative;
	background-color: white;
	font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans',sans-serif;
	font-size: 14px;
	user-select: text;
	-moz-user-select: text;
}
.lessLaborGoToDictionary-dark #lessLaborGoToDictionary-apiContent {
	background-color: #DDDDDD;
}
.lessLaborGoToDictionary-separator #lessLaborGoToDictionary-apiContent {
	border-top: none;
	border-left: solid 1px #808080;
	grid-column-start: 2;
	grid-column-end: 3;
	grid-row-start: 1;
	grid-row-end: 3;
}
.lessLaborGoToDictionary-enableWiktionary #lessLaborGoToDictionary-apiContent,
.lessLaborGoToDictionary-enableWikipedia #lessLaborGoToDictionary-apiContent {
	display: block;
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
.lessLaborGoToDictionary-selectWiktionary #lessLaborGoToDictionary-wiktionaryContent,
.lessLaborGoToDictionary-selectWikipedia #lessLaborGoToDictionary-wikipediaContent {
	display: block;
}
#lessLaborGoToDictionary-apiHeader {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	padding: 3px;
	display: flex;
	white-space: nowrap;
	overflow: hidden;
}
.lessLaborGoToDictionary-dark #lessLaborGoToDictionary-apiHeader {
	background: linear-gradient(#404040, #202020);
}
#lessLaborGoToDictionary-apiHeader > * {
	margin-right: 5px;
}
.lessLaborGoToDictionary-wikiContent {
	border-top: solid 1px #808080;
	display: none;
}
.lessLaborGoToDictionary-hide.lessLaborGoToDictionary-wikiContent,
.lessLaborGoToDictionary-apiDisabled .lessLaborGoToDictionary-wikiContent {
	display: none !important;
}
.lessLaborGoToDictionary-checkboxButton {
	position: relative;
	background-color: #808080;
	display: inline-block;
	height: 20px;
	width: 30px;
	min-width: 30px;
	border-radius: 15px;
	cursor: pointer;
	user-select: none;
	-moz-user-select: none;
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
.lessLaborGoToDictionary-apiTitleBox {
	font-size: 14px;
	padding: 5px;
}
.lessLaborGoToDictionary-loading .lessLaborGoToDictionary-apiTitleBox {
	display: none;
}
.lessLaborGoToDictionary-unmatchText.lessLaborGoToDictionary-hide {
	display: none;
}
.lessLaborGoToDictionary-historyButton {
	vertical-align: middle;
	margin-right: 5px;
}
#lessLaborGoToDictionary-historyDone, #lessLaborGoToDictionary-historyDone2 {
	cursor: auto;
}
.lessLaborGoToDictionary-historyButton.lessLaborGoToDictionary-hide {
		display: none;
}
#lessLaborGoToDictionary-apiOffMsg {
	display: none;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOffMsg {
	display: block;
}
.lessLaborGoToDictionary-apiLoading {
	padding: 5px;
	display: none;
	height: 8em;
	min-height: 8em;
}
.lessLaborGoToDictionary-separator .lessLaborGoToDictionary-apiLoading {
}
.lessLaborGoToDictionary-loading .lessLaborGoToDictionary-apiLoading {
	display: block;
}
.lessLaborGoToDictionary-apiDisabled .lessLaborGoToDictionary-apiLoading {
	display: none;
}
.lessLaborGoToDictionary-apiLoadingContent {
	background-repeat: no-repeat;
	background-position: center;
	height: 20px;
	width: 20px;
	border-radius: 10px;
	background-color: #5bd94d;
	animation: loading 0.2s linear infinite running;
}
@keyframes loading {
	0%{
		visibility: visible;
	}
	50%{
		visibility: hidden;
	}
	100%{
		visibility: hidden;
	}
}
#lessLaborGoToDictionary-apiOff {
	border-top: solid 1px #808080;
	display: none;
	padding: 3px;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOff {
	display: block;
}
.lessLaborGoToDictionary-apiWikiText {
	padding: 5px;
}
.lessLaborGoToDictionary-loading .lessLaborGoToDictionary-apiWikiText {
	display: none;
}
.lessLaborGoToDictionary-apiWikiText h1,
.lessLaborGoToDictionary-apiWikiText h2,
.lessLaborGoToDictionary-apiWikiText h3,
.lessLaborGoToDictionary-apiWikiText h4,
.lessLaborGoToDictionary-apiWikiText h5,
.lessLaborGoToDictionary-apiWikiText h6,
.lessLaborGoToDictionary-apiWikiText div,
.lessLaborGoToDictionary-apiWikiText p,
.lessLaborGoToDictionary-apiWikiText ol,
.lessLaborGoToDictionary-apiWikiText ul,
.lessLaborGoToDictionary-apiWikiText dl,
.lessLaborGoToDictionary-apiWikiText dt,
.lessLaborGoToDictionary-apiWikiText dd,
.lessLaborGoToDictionary-apiWikiText table {
	margin-top: 0.5em;
	margin-bottom: 1em;
}
.lessLaborGoToDictionary-apiWikiText h1 {
	font-size: 1.6em;
}
.lessLaborGoToDictionary-apiWikiText h2 {
	font-size: 1.5em;
}
.lessLaborGoToDictionary-apiWikiText h3 {
	font-size: 1.3em;
}
.lessLaborGoToDictionary-apiWikiText h4 {
	font-size: 1.2em;
}
.lessLaborGoToDictionary-apiWikiText h5 {
	font-size: 1.1em;
}
.lessLaborGoToDictionary-apiWikiText h6 {
	font-size: 1em;
}
.lessLaborGoToDictionary-apiWikiText ul,
.lessLaborGoToDictionary-apiWikiText ol {
	list-style-position: inside;
}
.lessLaborGoToDictionary-apiWikiText hr {
	border: none;
}
.lessLaborGoToDictionary-apiWikiText table {
	border-collapse: collapse;
}
.lessLaborGoToDictionary-apiWikiText th,
.lessLaborGoToDictionary-apiWikiText td {
	padding: 5px;
	text-align: left;
}
.lessLaborGoToDictionary-apiWikiText caption {
	text-align: left;
}
.lessLaborGoToDictionary-apiWikiText table.wikitable > tr > th,
.lessLaborGoToDictionary-apiWikiText table.wikitable > * > tr > th,
.lessLaborGoToDictionary-apiWikiText table.wikitable > tr > td,
.lessLaborGoToDictionary-apiWikiText table.wikitable > * > tr > td {
	border: 1px solid rgba(84,89,93,0.3);
}
.lessLaborGoToDictionary-apiWikiText table.wikitable > tr > th,
.lessLaborGoToDictionary-apiWikiText table.wikitable > * > tr > th {
	background-color: #eaecf0;
	font-weight: bold;
}
.lessLaborGoToDictionary-apiWikiText h1.in-block,
.lessLaborGoToDictionary-apiWikiText h2.in-block,
.lessLaborGoToDictionary-apiWikiText h3.in-block,
.lessLaborGoToDictionary-apiWikiText h4.in-block,
.lessLaborGoToDictionary-apiWikiText h5.in-block,
.lessLaborGoToDictionary-apiWikiText h6.in-block {
	border-bottom: solid 2px black;
}
.lessLaborGoToDictionary-apiWikiText h2.in-block::before {
	content: "# ";
}
.lessLaborGoToDictionary-apiWikiText .mw-empty-elt {
	display: none;
}
.lessLaborGoToDictionary-apiWikiText a.new {
	color: #dd3333;
}
.lessLaborGoToDictionary-apiWikiText table.wikitable {
	border: 1px solid black;
}
.lessLaborGoToDictionary-apiWikiText table.audiotable td,
.lessLaborGoToDictionary-apiWikiText table.audiotable th {
	border: none;
}
.lessLaborGoToDictionary-apiWikiText .NavFrame > .NavHead {
	cursor: pointer;
	background-color: #c0c0f0;
}
.lessLaborGoToDictionary-apiWikiText .NavFrame > .NavHead:hover {
	background-color: #c0f0c0;
}
.lessLaborGoToDictionary-apiWikiText .lessLaborGoToDictionary-play {
	display: inline-block;
	background: transparent;
	box-sizing: border-box;
	width: 0;
	height: 20px;
	border-color: transparent transparent transparent #888888;
	border-style: solid;
	border-width: 10px 0px 10px 20px;
	cursor: pointer;
	vertical-align: middle;
	margin: 2px;
}
.lessLaborGoToDictionary-apiWikiText .lessLaborGoToDictionary-play.lessLaborGoToDictionary-playing {
	background-color: #888888;
}
.lessLaborGoToDictionary-apiWikiText div.lessLaborGoToDictionary-apiWarningMessage {
	padding: 2px;
	border: solid 1px red;
	border-radius: 5px;
	background-color: rgba(255,0,0,0.65);
	color: white;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
}
.lessLaborGoToDictionary-openTabImage {
	vertical-align: middle;
	margin-left: 2px;
}
`;
