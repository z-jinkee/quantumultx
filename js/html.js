(function () {
  var b64 = "PCFET0NUWVBFIGh0bWw+PGh0bWwgbGFuZz0iemgtQ04iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9IlVURi04Ij48bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MS4wIj48dGl0bGU+SlNPTiDpoZrnv5rmtbrmhbrmsaV85Y2V5ZKM5ZyoPC90aXRsZT4=";

  function decodeBase64Utf8(str) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var clean = String(str || "").replace(/[^A-Za-z0-9+/=]/g, "");
    var bytes = [];
    for (var i = 0; i < clean.length; i += 4) {
      var c1 = chars.indexOf(clean.charAt(i));
      var c2 = chars.indexOf(clean.charAt(i + 1));
      var c3 = chars.indexOf(clean.charAt(i + 2));
      var c4 = chars.indexOf(clean.charAt(i + 3));
      if (c1 < 0 || c2 < 0) break;
      var b1 = (c1 << 2) | (c2 >> 4);
      bytes.push(b1 & 255);
      if (c3 >= 0 && clean.charAt(i + 2) !== "=") {
        var b2 = ((c2 & 15) << 4) | (c3 >> 2);
        bytes.push(b2 & 255);
      }
      if (c4 >= 0 && clean.charAt(i + 3) !== "=") {
        var b3 = ((c3 & 3) << 6) | c4;
        bytes.push(b3 & 255);
      }
    }
    var out = "";
    var j = 0;
    while (j < bytes.length) {
      var u1 = bytes[j++];
      if (u1 < 128) {
        out += String.fromCharCode(u1);
      } else if (u1 >= 192 && u1 < 224 && j < bytes.length) {
        var u2 = bytes[j++];
        out += String.fromCharCode(((u1 & 31) << 6) | (u2 & 63));
      } else if (u1 >= 224 && j + 1 < bytes.length) {
        var u3 = bytes[j++];
        var u4 = bytes[j++];
        out += String.fromCharCode(((u1 & 15) << 12) | ((u2 & 63) << 6) | (u3 & 63));
      }
    }
    return out;
  }

  var LT = String.fromCharCode(60);
  var GT = String.fromCharCode(62);
  var AMP = String.fromCharCode(38);

  var headHtml = ""
    + LT + "!DOCTYPE html" + GT
    + LT + "html lang=\"zh-CN\"" + GT
    + LT + "head" + GT
    + LT + "meta charset=\"UTF-8\"" + GT
    + LT + "meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no\"" + GT
    + LT + "title" + GT + "Jsonique" + LT + "/title" + GT
    + LT + "meta name=\"apple-mobile-web-app-capable\" content=\"yes\"" + GT
    + LT + "meta name=\"apple-mobile-web-app-status-bar-style\" content=\"default\"" + GT
    + LT + "meta name=\"apple-mobile-web-app-title\" content=\"Jsonique\"" + GT
    + LT + "link rel=\"apple-touch-icon\" sizes=\"512x512\" href=\"https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/eb/1c/a1/eb1ca1c1-be59-166e-4c27-a9823613128a/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png\"" + GT
    + LT + "/head" + GT;

  var bodyHtml = ""
    + LT + "body" + GT
    + LT + "div class=\"meta-bar\"" + GT
    + LT + "span id=\"st\"" + GT + "粘贴JSON后自动格式化" + LT + "/span" + GT
    + LT + "span id=\"lc\" class=\"bottom-lc\"" + GT + "行数0" + LT + "/span" + GT
    + LT + "/div" + GT
    + LT + "div id=\"inpBox\" class=\"box\"" + GT
    + LT + "textarea id=\"inp\" placeholder=\"在此粘贴或输入 JSON...\"" + GT + LT + "/textarea" + GT
    + LT + "/div" + GT
    + LT + "div class=\"btn-bar\"" + GT
    + LT + "div class=\"inp-btns\"" + GT
    + LT + "button id=\"btnColorLine\" class=\"act-btn fixed-btn btn-line\" type=\"button\"" + GT + "彩线：关" + LT + "/button" + GT
    + LT + "div class=\"pop-anchor\"" + GT
    + LT + "div id=\"indentPop\" class=\"pop-panel\"" + GT
    + LT + "div class=\"pop-title\"" + GT + "输出框缩进格数" + LT + "/div" + GT
    + LT + "div id=\"indentList\" class=\"theme-list\"" + GT + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "button id=\"btnIndent\" class=\"act-btn fixed-btn btn-indent\" type=\"button\"" + GT + "缩进4格" + LT + "/button" + GT
    + LT + "/div" + GT
    + LT + "div class=\"pop-anchor\"" + GT
    + LT + "div id=\"themePop\" class=\"pop-panel\"" + GT
    + LT + "div class=\"pop-title\"" + GT + "输出窗口字体配色" + LT + "/div" + GT
    + LT + "div id=\"themeList\" class=\"theme-list\"" + GT + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "button id=\"btnTheme\" class=\"act-btn fixed-btn btn-theme\" type=\"button\"" + GT + "配色蓝绿" + LT + "/button" + GT
    + LT + "/div" + GT
    + LT + "div class=\"pop-anchor\"" + GT
    + LT + "div id=\"fontPop\" class=\"pop-panel\"" + GT
    + LT + "div class=\"pop-title\"" + GT + "滑动调节字号：" + LT + "span id=\"fontValTxt\"" + GT + "13px" + LT + "/span" + GT + LT + "/div" + GT
    + LT + "input id=\"fontSlider\" class=\"font-slider\" type=\"range\" min=\"11\" max=\"18\" step=\"1\" value=\"13\" /" + GT
    + LT + "div class=\"font-ticks\"" + GT
    + LT + "span onclick=\"pickFont(11)\"" + GT + "11" + LT + "/span" + GT
    + LT + "span onclick=\"pickFont(13)\"" + GT + "13" + LT + "/span" + GT
    + LT + "span onclick=\"pickFont(15)\"" + GT + "15" + LT + "/span" + GT
    + LT + "span onclick=\"pickFont(18)\"" + GT + "18" + LT + "/span" + GT
    + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "button id=\"btnFont\" class=\"act-btn fixed-btn btn-font\" type=\"button\"" + GT + "字体13px" + LT + "/button" + GT
    + LT + "/div" + GT
    + LT + "button id=\"btnClear\" class=\"act-btn fixed-btn btn-clear\" type=\"button\"" + GT + "清空内容" + LT + "/button" + GT
    + LT + "button id=\"btnCopy\" class=\"act-btn fixed-btn btn-copy\" type=\"button\"" + GT + "拷贝内容" + LT + "/button" + GT
    + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "div id=\"viewBox\" class=\"box view-compact\"" + GT
    + LT + "div id=\"outerWrap\" class=\"outer-wrap\"" + GT
    + LT + "div id=\"onums\" class=\"outer-nums\"" + GT + LT + "/div" + GT
    + LT + "div class=\"tree\" id=\"tree\"" + GT + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "div id=\"modalMask\" class=\"modal-mask\"" + GT
    + LT + "div class=\"modal-card\"" + GT
    + LT + "div id=\"modalTitle\" class=\"modal-title\"" + GT + "层级批量处理与 jq 生成" + LT + "/div" + GT
    + LT + "div class=\"field-lbl\"" + GT + "当前路径" + LT + "/div" + GT
    + LT + "div id=\"modalPath\" class=\"modal-path\"" + GT + LT + "/div" + GT
    + LT + "div id=\"batchArea\"" + GT + LT + "/div" + GT
    + LT + "div class=\"field-lbl\"" + GT + "合并生成的单条 jq 表达式" + LT + "/div" + GT
    + LT + "textarea id=\"jqOut\" class=\"jq-out\" rows=\"3\" spellcheck=\"false\"" + GT + LT + "/textarea" + GT
    + LT + "div class=\"modal-btns\"" + GT
    + LT + "button id=\"btnCopyJq\" class=\"act-btn primary fixed-btn\" type=\"button\"" + GT + "复制 jq" + LT + "/button" + GT
    + LT + "button id=\"btnCloseModal\" class=\"act-btn fixed-btn\" type=\"button\"" + GT + "关闭" + LT + "/button" + GT
    + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "/div" + GT
    + LT + "script" + GT
    + "(function(){var lastTap=0;document.addEventListener(\"touchend\",function(e){var tag=e.target&&e.target.tagName;if(tag===\"TEXTAREA\"||tag===\"INPUT\"||tag===\"SELECT\"||tag===\"OPTION\")return;var now=Date.now();if(now-lastTap<=350){e.preventDefault()}lastTap=now},{passive:false})})();"
    + "var inp=document.getElementById(\"inp\"),btnColorLine=document.getElementById(\"btnColorLine\"),btnIndent=document.getElementById(\"btnIndent\"),btnTheme=document.getElementById(\"btnTheme\"),btnFont=document.getElementById(\"btnFont\"),btnClear=document.getElementById(\"btnClear\"),btnCopy=document.getElementById(\"btnCopy\");"
    + "var indentPop=document.getElementById(\"indentPop\"),indentList=document.getElementById(\"indentList\");"
    + "var themePop=document.getElementById(\"themePop\"),themeList=document.getElementById(\"themeList\");"
    + "var fontPop=document.getElementById(\"fontPop\"),fontSlider=document.getElementById(\"fontSlider\"),fontValTxt=document.getElementById(\"fontValTxt\");"
    + "var viewBox=document.getElementById(\"viewBox\"),outerWrap=document.getElementById(\"outerWrap\"),onums=document.getElementById(\"onums\"),tree=document.getElementById(\"tree\"),st=document.getElementById(\"st\"),lc=document.getElementById(\"lc\");"
    + "var modalMask=document.getElementById(\"modalMask\"),modalTitle=document.getElementById(\"modalTitle\"),modalPath=document.getElementById(\"modalPath\"),batchArea=document.getElementById(\"batchArea\"),jqOut=document.getElementById(\"jqOut\");"
    + "var btnCopyJq=document.getElementById(\"btnCopyJq\"),btnCloseModal=document.getElementById(\"btnCloseModal\");"
    + "var nodeMap={},nodeSeq=0,curInfo=null,draftRows=[],delSelf=false;"
    + "var curFontSize=13,clearTimer=null,copyTimer=null,jqCopyTimer=null;"
    + "var colorLineEnabled=false,depthPalette=[];"
    + "var indentOptions=[2,4,6,8],curIndent=4;"
    
    + "var themes=["
    + "{id:\"nord\",shortName:\"默认\",label:\"默认\",k:\"#2868c4\",s:\"#d83b52\",n:\"#4fa85b\",b:\"#a45bd6\",nl:\"#657997\",dk:\"#68a5f5\",ds:\"#ed8965\",dn:\"#8bd66b\",db:\"#c18aeb\",dnl:\"#7487a5\"},"
    + "{id:\"monokai\",shortName:\"深邃\",label:\"深邃\",k:\"#c75b7a\",s:\"#2aa198\",n:\"#d49b35\",b:\"#5b7ce6\",nl:\"#7d8590\",dk:\"#f07198\",ds:\"#38c7bd\",dn:\"#ebb64b\",db:\"#7b9cff\",dnl:\"#9aa2ad\"},"
    + "{id:\"dracula\",shortName:\"暗夜\",label:\"暗夜\",k:\"#2b9eb3\",s:\"#d95f43\",n:\"#9b5de5\",b:\"#3ca35a\",nl:\"#7c8291\",dk:\"#4cc9f0\",ds:\"#f47c5e\",dn:\"#b57edc\",db:\"#52c472\",dnl:\"#989ea8\"},"
    + "{id:\"tokyo\",shortName:\"樱墨\",label:\"樱墨\",k:\"#d97724\",s:\"#6c5ce7\",n:\"#16a085\",b:\"#d63384\",nl:\"#7a828e\",dk:\"#f39c42\",ds:\"#8e7dff\",dn:\"#2ec4a6\",db:\"#f25ca2\",dnl:\"#9aa2ae\"}"
    + "];"

    + "var curThemeIdx=0,isDarkMode=window.matchMedia&&window.matchMedia(\"(prefers-color-scheme:dark)\").matches;"
    + "function renderIndentChoices(){var h=\"\";for(var i=0;i<indentOptions.length;i++){var n=indentOptions[i];var act=n===curIndent?\" active\":\"\";h+=\"<button type='button' class='theme-opt\"+act+\"' onclick='pickIndent(\"+n+\")'><span>\"+n+\" 格</span><span>\"+(n===4?\"默认\":\"\")+\"</span></button>\"}indentList.innerHTML=h}"
    + "function applyIndent(n){var v=Number(n);if(indentOptions.indexOf(v)===-1)v=4;curIndent=v;btnIndent.textContent=\"缩进\"+v+\"格\";tree.style.setProperty(\"--indent-w\",(v*4)+\"px\");renderIndentChoices()}"
    + "window.pickIndent=function(n){applyIndent(n);indentPop.style.display=\"none\"};"
    + "function applyTheme(idx){curThemeIdx=(idx+themes.length)%themes.length;var t=themes[curThemeIdx];btnTheme.textContent=\"配色\"+t.shortName;tree.style.setProperty(\"--k\",isDarkMode?t.dk:t.k);tree.style.setProperty(\"--s\",isDarkMode?t.ds:t.s);tree.style.setProperty(\"--n\",isDarkMode?t.dn:t.n);tree.style.setProperty(\"--b\",isDarkMode?t.db:t.b);tree.style.setProperty(\"--nl\",isDarkMode?t.dnl:t.nl);renderThemeChoices()}"
    + "function renderThemeChoices(){var h=\"\";for(var i=0;i<themes.length;i++){var item=themes[i];var act=i===curThemeIdx?\" active\":\"\";var sw1=isDarkMode?item.dk:item.k;var sw2=isDarkMode?item.ds:item.s;var sw3=isDarkMode?item.dn:item.n;h+=\"<button type='button' class='theme-opt\"+act+\"' onclick='pickTheme(\"+i+\")'><span>\"+esc(item.label)+\"</span><span class='theme-dots'><i style='background:\"+sw1+\"'></i><i style='background:\"+sw2+\"'></i><i style='background:\"+sw3+\"'></i></span></button>\"}themeList.innerHTML=h}"
    + "window.pickTheme=function(i){applyTheme(i);themePop.style.display=\"none\"};"
    + "if(window.matchMedia){var mq=window.matchMedia(\"(prefers-color-scheme:dark)\");var onMq=function(){isDarkMode=mq.matches;applyTheme(curThemeIdx)};if(mq.addEventListener)mq.addEventListener(\"change\",onMq);else if(mq.addListener)mq.addListener(onMq)}"
    + "function makeDepthPalette(){var hues=[205,145,35,275,345,175,55,235];var arr=[];for(var i=0;i<hues.length;i++){var h=(hues[i]+Math.floor(Math.random()*24)-12+360)%360;var l=isDarkMode?64:58;arr.push(\"hsla(\"+h+\",42%,\"+l+\"%,0.65)\")}return arr}"
    + "depthPalette=makeDepthPalette();"
    + "function applyColorLineState(){btnColorLine.textContent=colorLineEnabled?\"彩线：开\":\"彩线：关\";if(colorLineEnabled){btnColorLine.className=\"act-btn fixed-btn btn-line active-toggle\"}else{btnColorLine.className=\"act-btn fixed-btn btn-line\"}if(inp.value.trim()){run(false)}}"
    + "btnColorLine.onclick=function(){colorLineEnabled=!colorLineEnabled;if(colorLineEnabled)depthPalette=makeDepthPalette();applyColorLineState()};"
    + "function getLineStyleAttr(depthIdx){if(!colorLineEnabled)return \"\";var col=depthPalette[depthIdx%depthPalette.length];return \" style='border-left-color:\"+col+\"'\"}"
    + "function applyFontSize(px){var n=Number(px)||13;if(n<11)n=11;if(n>18)n=18;curFontSize=n;fontSlider.value=n;fontValTxt.textContent=n+\"px\";tree.style.fontSize=n+\"px\";btnFont.textContent=\"字体\"+n+\"px\"}"
    + "window.pickFont=function(sz){applyFontSize(sz)};"
    + "fontSlider.addEventListener(\"input\",function(){applyFontSize(fontSlider.value)});"
    + "function closeAllPops(){indentPop.style.display=\"none\";fontPop.style.display=\"none\";themePop.style.display=\"none\"}"
    + "btnIndent.onclick=function(e){e.stopPropagation();var open=indentPop.style.display===\"block\";closeAllPops();indentPop.style.display=open?\"none\":\"block\"};"
    + "btnTheme.onclick=function(e){e.stopPropagation();var open=themePop.style.display===\"block\";closeAllPops();themePop.style.display=open?\"none\":\"block\"};"
    + "btnFont.onclick=function(e){e.stopPropagation();var open=fontPop.style.display===\"block\";closeAllPops();fontPop.style.display=open?\"none\":\"block\"};"
    + "document.addEventListener(\"click\",function(e){if(!indentPop.contains(e.target)&&e.target!==btnIndent&&!fontPop.contains(e.target)&&e.target!==btnFont&&!themePop.contains(e.target)&&e.target!==btnTheme){closeAllPops()}});"
    + "function flashBtn(btn,tempText,origText,ms,timerKey){btn.textContent=tempText;if(timerKey===\"clear\"&&clearTimer)clearTimeout(clearTimer);if(timerKey===\"copy\"&&copyTimer)clearTimeout(copyTimer);if(timerKey===\"jq\"&&jqCopyTimer)clearTimeout(jqCopyTimer);var t=setTimeout(function(){btn.textContent=origText},ms);if(timerKey===\"clear\")clearTimer=t;else if(timerKey===\"copy\")copyTimer=t;else jqCopyTimer=t}"
    + "function setExpanded(exp){viewBox.className=exp?\"box view-expanded\":\"box view-compact\"}"
    + "function esc(s){return String(s).replace(/&/g,\"" + AMP + "amp;\").replace(/</g,\"" + AMP + "lt;\").replace(/>/g,\"" + AMP + "gt;\").replace(/\"/g,\"" + AMP + "quot;\")}"
    + "function copyText(txt,okMsg){if(!txt)return;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){if(okMsg)st.textContent=okMsg}).catch(function(){fallbackCopy(txt,okMsg)})}else{fallbackCopy(txt,okMsg)}}"
    + "function fallbackCopy(txt,okMsg){var ta=document.createElement(\"textarea\");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand(\"copy\");if(okMsg)st.textContent=okMsg}catch(e){}document.body.removeChild(ta)}"
    + "function renderVal(v){if(v===null)return \"<span class='nl'>null</span>\";if(typeof v===\"string\")return \"<span class='s'>\"+esc(JSON.stringify(v))+\"</span>\";if(typeof v===\"number\")return \"<span class='n'>\"+v+\"</span>\";if(typeof v===\"boolean\")return \"<span class='b'>\"+v+\"</span>\";return \"\"}"
    + "function joinJqPath(parentJq,k){if(typeof k===\"number\")return (parentJq||\".\")+\"[\"+k+\"]\";var ks=String(k);if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(ks))return (parentJq===\".\"?\"\":parentJq)+\".\"+ks;return (parentJq||\".\")+\"[\"+JSON.stringify(ks)+\"]\"}"
    + "function relJqSeg(k){if(typeof k===\"number\")return \"[\"+k+\"]\";var ks=String(k);if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(ks))return \".\"+ks;return \"[\"+JSON.stringify(ks)+\"]\"}"
    + "function keepKeyExpr(k){var ks=String(k);if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(ks))return ks;return JSON.stringify(ks)}"
    + "function parseInputVal(raw){var s=String(raw);if(!s.length)return \"\";try{return JSON.parse(s)}catch(e){return s}}"
    + "function build(k,v,parentJq,depth,root){var curJq=root?\".\":joinJqPath(parentJq,k);var pid=\"n\"+(++nodeSeq);nodeMap[pid]={jq:curJq,val:v};var isA=Array.isArray(v),isO=!isA&&v!==null&&typeof v===\"object\",br=isA||isO;var indentHtml=\"\";for(var d=0;d<depth;d++){indentHtml+=\"<span class='line-col'\"+getLineStyleAttr(d)+\"></span>\"}var swHtml=br?(\"<span class='sw' onclick='tog(this)'>−</span>\"):(\"<span class='leaf-sp'>·</span>\");var txtHtml=\"\";if(k!==null){txtHtml+=\"<span class='k'>\"+(typeof k===\"number\"?\"[\"+k+\"]\":esc(JSON.stringify(String(k))))+\"</span><span class='punc'>: </span>\"}if(br){var c=isA?v.length:Object.keys(v).length;txtHtml+=\"<span class='m'>{\" + c + \"}</span><span class='fold-tag' style='display:none'>已折叠</span>\";var rowHtml=\"<div class='row-line'>\"+indentHtml+swHtml+\"<span class='node-txt' data-pid='\"+pid+\"' onclick='openBatchModal(this)'>\"+txtHtml+\"</span></div>\";var childHtml=\"<div class='ch-wrap'>\";if(isA){for(var i=0;i<v.length;i++){childHtml+=build(i,v[i],curJq,depth+1,false)}}else{var ks=Object.keys(v);for(var j=0;j<ks.length;j++){childHtml+=build(ks[j],v[ks[j]],curJq,depth+1,false)}}childHtml+=\"</div>\";return \"<div class='node-block'>\"+rowHtml+childHtml+\"</div>\"}else{txtHtml+=renderVal(v);return \"<div class='node-block'><div class='row-line'>\"+indentHtml+swHtml+\"<span class='node-txt' data-pid='\"+pid+\"' onclick='openBatchModal(this)'>\"+txtHtml+\"</span></div></div>\"}}"
    + "function buildSingleExpr(targetExpr,r){if(r.del)return \"del(\" + targetExpr + \")\";if(!r.changed)return \"\";return targetExpr + \" = \" + JSON.stringify(parseInputVal(r.rawVal))}"
    + "function recomputeJq(){if(!curInfo)return;if(delSelf){jqOut.value=\"del(\" + curInfo.jq + \")\";return}if(curInfo.isBranch){var keptRows=[];for(var kIdx=0;kIdx<draftRows.length;kIdx++){if(draftRows[kIdx].keep)keptRows.push(draftRows[kIdx])}var hasKeep=keptRows.length>0;var keepExpr=\"\";if(hasKeep){if(Array.isArray(curInfo.val)){var arrItems=[];for(var a=0;a<keptRows.length;a++){var ar=keptRows[a];if(ar.changed){arrItems.push(JSON.stringify(parseInputVal(ar.rawVal)))}else{arrItems.push(\".[\"+ar.key+\"]\")}}keepExpr=\"[\" + arrItems.join(\", \") + \"]\"}else{var objItems=[];for(var o=0;o<keptRows.length;o++){var orow=keptRows[o];if(orow.changed){objItems.push(keepKeyExpr(orow.key)+\": \"+JSON.stringify(parseInputVal(orow.rawVal)))}else{objItems.push(keepKeyExpr(orow.key))}}keepExpr=\"{ \" + objItems.join(\", \") + \" }\"}}var mutParts=[];for(var i=0;i<draftRows.length;i++){var r=draftRows[i];if(hasKeep&&!r.keep)continue;if(r.keep)continue;var subExpr=buildSingleExpr(r.rel,r);if(subExpr)mutParts.push(subExpr)}var steps=[];if(keepExpr)steps.push(keepExpr);if(mutParts.length)steps.push(mutParts.join(\" | \"));if(!steps.length){jqOut.value=\"\";return}var inner=steps.join(\" | \");if(curInfo.jq===\".\"){jqOut.value=inner}else{jqOut.value=curInfo.jq+\" |= (\"+inner+\")\"}}else{var leaf=draftRows[0];if(!leaf){jqOut.value=\"\";return}if(leaf.del){jqOut.value=\"del(\" + curInfo.jq + \")\"}else if(leaf.changed){jqOut.value=curInfo.jq + \" = \" + JSON.stringify(parseInputVal(leaf.rawVal))}else{jqOut.value=\"\"}}}"
    + "window.onToggleSelf=function(cb){delSelf=cb.checked;recomputeJq()};"
    + "window.onRowKeep=function(idx,cb){draftRows[idx].keep=cb.checked;if(cb.checked)draftRows[idx].del=false;renderBatchRows();recomputeJq()};"
    + "window.onRowCheck=function(idx,cb){draftRows[idx].del=cb.checked;if(cb.checked)draftRows[idx].keep=false;renderBatchRows();recomputeJq()};"
    + "window.onRowVal=function(idx,el){draftRows[idx].rawVal=el.value;draftRows[idx].changed=true;recomputeJq()};"
    + "function renderBatchRows(){var h=\"\";if(curInfo.isBranch){h+=\"<div class='self-box'><label class='self-chk'><input type='checkbox' \"+(delSelf?\"checked\":\"\")+\" onchange='onToggleSelf(this)'><span>屏蔽当前层级（\"+esc(curInfo.jq)+\"）</span></label></div>\";h+=\"<div class='field-lbl'>子项批量：勾选“保留”或者”屏蔽” 也可填新值</div><div class='batch-list'>\";for(var i=0;i<draftRows.length;i++){var r=draftRows[i];h+=\"<div class='batch-row'><span class='b-key' title='\"+esc(r.label)+\"'>\"+esc(r.label)+\"</span><input class='b-val' type='text' value='\"+esc(r.rawVal)+\"' oninput='onRowVal(\"+i+\",this)' placeholder='新值'><label class='b-chk keep-chk'><input type='checkbox' \"+(r.keep?\"checked\":\"\")+\" onchange='onRowKeep(\"+i+\",this)'>保留</label><label class='b-chk'><input type='checkbox' \"+(r.del?\"checked\":\"\")+\" onchange='onRowCheck(\"+i+\",this)'>屏蔽</label></div>\"}h+=\"</div>\"}else{var r0=draftRows[0];h+=\"<div class='field-lbl'>当前值（修改或勾选屏蔽）</div><div class='batch-row'><span class='b-key'>当前项</span><input class='b-val' type='text' value='\"+esc(r0.rawVal)+\"' oninput='onRowVal(0,this)' placeholder='新值'><label class='b-chk'><input type='checkbox' \"+(r0.del?\"checked\":\"\")+\" onchange='onRowCheck(0,this)'>屏蔽</label></div>\"}batchArea.innerHTML=h}"
    + "window.openBatchModal=function(el){var pid=el.getAttribute(\"data-pid\");var info=nodeMap[pid];if(!info)return;curInfo=info;delSelf=false;var v=info.val;var isA=Array.isArray(v),isO=!isA&&v!==null&&typeof v===\"object\";info.isBranch=isA||isO;modalTitle.textContent=info.isBranch?\"当前层级与子项批量 jq 生成\":\"单节点修改 / 屏蔽\";modalPath.textContent=info.jq;draftRows=[];if(info.isBranch){if(isA){for(var i=0;i<v.length;i++){var iv=v[i];draftRows.push({key:i,label:\"[\"+i+\"]\",rel:relJqSeg(i),rawVal:(iv!==null&&typeof iv===\"object\")?JSON.stringify(iv):String(iv),changed:false,keep:false,del:false})}}else{var ks=Object.keys(v);for(var j=0;j<ks.length;j++){var k=ks[j];var kv=v[k];draftRows.push({key:k,label:k,rel:relJqSeg(k),rawVal:(kv!==null&&typeof kv===\"object\")?JSON.stringify(kv):String(kv),changed:false,keep:false,del:false})}}}else{draftRows.push({key:null,label:\"value\",rel:\"\",rawVal:(v!==null&&typeof v===\"object\")?JSON.stringify(v):String(v),changed:false,keep:false,del:false})}renderBatchRows();recomputeJq();modalMask.style.display=\"flex\"};"
    + "btnCopyJq.onclick=function(){if(!jqOut.value)return;copyText(jqOut.value,\"\");flashBtn(btnCopyJq,\"已复制\",\"复制 jq\",1000,\"jq\")};"
    + "btnCloseModal.onclick=function(){modalMask.style.display=\"none\"};"
    + "modalMask.onclick=function(e){if(e.target===modalMask)modalMask.style.display=\"none\"};"
    + "function isHiddenNode(el){var p=el.parentNode;while(p&&p!==tree){if(p.className&&p.className.indexOf(\"ch-collapsed\")>-1)return true;p=p.parentNode}return false}"
    + "function syncNums(){var rows=tree.getElementsByClassName(\"row-line\"),vis=0;for(var i=0;i<rows.length;i++){if(!isHiddenNode(rows[i]))vis++}var htmlNums=\"\";for(var n=1;n<=vis;n++){htmlNums+=\"<div class='num-cell'>\"+n+\"</div>\"}onums.innerHTML=htmlNums;lc.textContent=\"行数：\"+vis}"
    + "function setFoldBadge(rowEl,collapsed){var spans=rowEl.getElementsByClassName(\"fold-tag\");if(spans&&spans.length>0){spans[0].style.display=collapsed?\"inline\":\"none\"}}"
    + "window.tog=function(el){var row=el.parentNode;var block=row.parentNode;var ch=null;for(var i=0;i<block.children.length;i++){if(block.children[i].className&&block.children[i].className.indexOf(\"ch-wrap\")>-1){ch=block.children[i];break}}if(!ch)return;if(ch.className.indexOf(\"ch-collapsed\")>-1){ch.className=\"ch-wrap\";el.textContent=\"−\";setFoldBadge(row,false)}else{ch.className=\"ch-wrap ch-collapsed\";el.textContent=\"+\";setFoldBadge(row,true)};syncNums()};"
    + "function run(autoFmt){var t=inp.value.trim();if(!t){setExpanded(false);tree.innerHTML=\"\";onums.innerHTML=\"\";lc.textContent=\"行数：0\";st.textContent=\"等待粘贴 JSON\";return}try{var d=JSON.parse(t);var pretty=JSON.stringify(d,null,4);if(autoFmt&&inp.value!==pretty)inp.value=pretty;setExpanded(true);nodeMap={};nodeSeq=0;tree.innerHTML=build(\"root\",d,\".\",0,true);syncNums();st.textContent=\"已自动格式化并展开\"}catch(e){setExpanded(true);tree.innerHTML=\"<span style='color:#0284c7'>\"+esc(e.message)+\"</span>\";onums.innerHTML=\"\";lc.textContent=\"行数：0\";st.textContent=\"JSON 格式错误\"}}"
    + "btnClear.onclick=function(){inp.value=\"\";run(false);flashBtn(btnClear,\"已清空\",\"清空内容\",2000,\"clear\")};"
    + "btnCopy.onclick=function(){if(!inp.value)return;copyText(inp.value,\"\");flashBtn(btnCopy,\"已拷贝\",\"拷贝内容\",2000,\"copy\")};"
    + "inp.addEventListener(\"paste\",function(){setTimeout(function(){run(true)},0)});"
    + "inp.addEventListener(\"input\",function(){run(false)});"
    + "applyFontSize(curFontSize);applyIndent(curIndent);applyTheme(curThemeIdx);"
    + LT + "/script" + GT
    + LT + "/body" + GT + LT + "/html" + GT;

  var styleHtml = ""
    + LT + "style" + GT
    + ":root{--bg:#ffffff;--card:#EBEFF5;--sub:#e8eef6;--hover:#dce5f2;--fg:#0f172a;--mut:#5b6b82;--bd:#d4dfed;--line:#8fa3bd;--punc:#8fa3bd;--k:#0284c7;--s:#15803d;--n:#b45309;--b:#6d28d9;--nl:#0369a1;--acc:#2563eb;--row-h:30px;--box-shadow:0 4px 16px rgba(15,23,42,0.05);--btn-shadow:0 1px 2px rgba(15,23,42,0.04)}"
    + "@media(prefers-color-scheme:dark){:root{--bg:#090d16;--card:#111827;--sub:#0d1322;--hover:#1a253b;--fg:#f1f5f9;--mut:#8b9bb4;--bd:#1e293b;--line:#475569;--punc:#64748b;--k:#38bdf8;--s:#4ade80;--n:#facc15;--b:#c084fc;--nl:#38bdf8;--acc:#3b82f6;--row-h:30px;--box-shadow:none;--btn-shadow:none}}"
    + "*{box-sizing:border-box;touch-action:manipulation;-webkit-tap-highlight-color:transparent}"
    + "body{margin:0;padding:24px 12px 12px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','PingFang SC','Microsoft YaHei',sans-serif;background:var(--bg);min-height:100vh;color:var(--fg);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}"
    + ".meta-bar{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mut);margin-bottom:8px;padding:0 2px}"
    + ".box{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:10px;margin-bottom:10px;box-shadow:var(--box-shadow)}"
    + ".box-title{font-size:12px;font-weight:600;color:var(--mut);margin-bottom:6px;padding-left:2px}"
    + "textarea{width:100%;height:120px;border:0;padding:2px 2px 0;background:transparent;color:var(--fg);font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,'PingFang SC',monospace;font-size:16px;line-height:1.55;resize:vertical;outline:none}"
    + ".btn-bar{display:flex;justify-content:flex-end;align-items:center;margin-bottom:10px}"
    + ".inp-btns{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}"
    + ".pop-anchor{position:relative;display:inline-flex}"
    + ".pop-panel{display:none;position:absolute;bottom:calc(100% + 6px);right:0;width:190px;padding:10px;border-radius:10px;border:1px solid var(--bd);background:var(--card);box-shadow:0 12px 28px rgba(15,23,42,0.16);z-index:50}"
    + "@media(prefers-color-scheme:dark){.pop-panel{box-shadow:0 12px 28px rgba(0,0,0,0.35)}}"
    + ".pop-title{font-size:11.5px;color:var(--mut);margin-bottom:7px;display:flex;justify-content:space-between}"
    + ".theme-list{display:flex;flex-direction:column;gap:5px}"
    + ".theme-opt{display:flex;align-items:center;justify-content:space-between;width:100%;padding:6px 8px;font-size:12px;border-radius:7px;border:1px solid var(--bd);background:var(--sub);color:var(--fg);cursor:pointer}"
    + ".theme-opt:hover{background:var(--hover)}"
    + ".theme-opt.active{border-color:var(--acc);background:var(--hover)}"
    + ".theme-dots{display:inline-flex;gap:4px}"
    + ".theme-dots i{display:inline-block;width:9px;height:9px;border-radius:50%}"
    + ".font-slider{width:100%;margin:4px 0 6px;accent-color:var(--acc);cursor:pointer}"
    + ".font-ticks{display:flex;justify-content:space-between;font-size:11px;color:var(--mut)}"
    + ".font-ticks span{cursor:pointer;padding:1px 4px;border-radius:4px}"
    + ".font-ticks span:hover{background:var(--hover);color:var(--fg)}"
    + ".act-btn{padding:6px 12px;font-size:12px;font-weight:500;border-radius:7px;border:1px solid var(--bd);background:var(--sub);color:var(--fg);cursor:pointer;white-space:nowrap;box-shadow:var(--btn-shadow);transition:background 0.15s,border-color 0.15s,color 0.15s}"
    + ".fixed-btn{width:84px;text-align:center;padding-left:0;padding-right:0}"
    + ".btn-line{background:#eef4ff;border-color:#bfd4f7;color:#1d4ed8}"
    + ".btn-line:hover{background:#dfecff;border-color:#9fc0f5}"
    + ".btn-indent{background:#ecfdf5;border-color:#b7ebd4;color:#047857}"
    + ".btn-indent:hover{background:#d7f9ea;border-color:#90dec0}"
    + ".btn-theme{background:#f5f3ff;border-color:#d8cdfc;color:#6d28d9}"
    + ".btn-theme:hover{background:#eae5ff;border-color:#beabf9}"
    + ".btn-font{background:#fffbeb;border-color:#f7dfa1;color:#b45309}"
    + ".btn-font:hover{background:#fef3c7;border-color:#f0ce78}"
    + ".btn-clear{background:#fef2f2;border-color:#fad0d0;color:#b91c1c}"
    + ".btn-clear:hover{background:#fee2e2;border-color:#f5b0b0}"
    + ".btn-copy{background:#eff6ff;border-color:#b9d7fc;color:#0369a1}"
    + ".btn-copy:hover{background:#dbeafe;border-color:#93c3fa}"
    + ".active-toggle{border-color:#2563eb;color:#1e40af;background:#dbeafe;font-weight:600}"
    + "@media(prefers-color-scheme:dark){"
    + ".btn-line{background:#13233f;border-color:#26457a;color:#93c5fd}.btn-line:hover{background:#182d52}"
    + ".btn-indent{background:#0f2b24;border-color:#1e5446;color:#6ee7b7}.btn-indent:hover{background:#14382f}"
    + ".btn-theme{background:#23183d;border-color:#442f78;color:#d8b4fe}.btn-theme:hover{background:#2d1f4f}"
    + ".btn-font{background:#2e210d;border-color:#5c4218;color:#fcd34d}.btn-font:hover{background:#3b2a11}"
    + ".btn-clear{background:#331418;border-color:#69262f;color:#fca5a5}.btn-clear:hover{background:#42191e}"
    + ".btn-copy{background:#10293d;border-color:#1f4f75;color:#7dd3fc}.btn-copy:hover{background:#15354f}"
    + ".active-toggle{border-color:#60a5fa;color:#bfdbfe;background:#1e3a8a;font-weight:600}"
    + "}"
    + ".act-btn.primary{background:linear-gradient(180deg,#3b82f6 0%,#2563eb 100%);color:#ffffff;border-color:#1d4ed8;box-shadow:0 2px 6px rgba(37,99,235,0.25)}"
    + ".view-compact{height:1000px;overflow:hidden}"
    + ".view-expanded{height:auto;overflow:visible}"
    + ".outer-wrap{display:flex;align-items:flex-start;overflow:auto;font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,'PingFang SC',monospace}"
    + ".outer-nums{flex-shrink:0;padding-right:10px;margin-right:10px;border-right:1px solid var(--bd);text-align:right;color:var(--mut);font-size:12px;user-select:none;background:linear-gradient(90deg,transparent 0%,rgba(238,243,249,0.45) 100%)}"
    + "@media(prefers-color-scheme:dark){.outer-nums{background:none}}"
    + ".num-cell{height:var(--row-h);line-height:var(--row-h);display:flex;align-items:center;justify-content:flex-end}"
    + ".tree{flex:1;min-width:0;font-size:13px;--indent-w:16px}"
    + ".node-block{display:block}"
    + ".ch-wrap{display:block}"
    + ".ch-collapsed{display:none}"
    + ".row-line{display:flex;align-items:center;height:var(--row-h);line-height:var(--row-h);white-space:nowrap}"
    + ".line-col{display:inline-block;width:var(--indent-w);height:var(--row-h);flex-shrink:0;border-left:1px solid var(--line);margin-right:2px}"
    + ".sw{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-right:6px;border:1px solid var(--bd);border-radius:5px;background:var(--sub);color:var(--fg);font-size:13px;font-weight:700;line-height:1;cursor:pointer;user-select:none;flex-shrink:0;box-shadow:var(--btn-shadow)}"
    + ".sw:hover{background:var(--hover);border-color:var(--acc)}"
    + ".leaf-sp{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-right:6px;color:var(--mut);font-size:14px;line-height:1;user-select:none;flex-shrink:0}"
    + ".node-txt{cursor:pointer;border-radius:5px;padding:0 5px;height:24px;line-height:24px;display:inline-flex;align-items:center;gap:2px;transition:background 0.15s}"
    + ".node-txt:hover{background:var(--hover)}"
    + ".punc{color:var(--punc)}"
    + ".k{color:var(--k);font-weight:600}.s{color:var(--s)}.n{color:var(--n);font-weight:500}.b{color:var(--b);font-weight:600}.nl{color:var(--nl);font-style:italic}.m{color:var(--mut);font-size:11.5px;font-weight:500}"
    + ".fold-tag{margin-left:6px;font-size:11px;color:#ef4444;font-weight:700}"
    + ".modal-mask{display:none;position:fixed;inset:0;background:rgba(15,23,42,0.45);backdrop-filter:blur(2px);align-items:center;justify-content:center;padding:12px;z-index:99;overflow:auto}"
    + "@media(prefers-color-scheme:dark){.modal-mask{background:rgba(2,6,23,0.6);backdrop-filter:none}}"
    + ".modal-card{width:100%;max-width:720px;max-height:92vh;overflow:auto;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:16px;box-shadow:0 16px 36px rgba(15,23,42,0.22)}"
    + "@media(prefers-color-scheme:dark){.modal-card{box-shadow:0 16px 36px rgba(0,0,0,0.4)}}"
    + ".modal-title{font-size:14px;font-weight:600;margin-bottom:8px}"
    + ".field-lbl{font-size:12px;color:var(--mut);margin-bottom:4px}"
    + ".modal-path{font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,monospace;font-size:12.5px;padding:7px 10px;border-radius:7px;background:var(--sub);border:1px solid var(--bd);word-break:break-all;margin-bottom:8px}"
    + ".self-box{padding:7px 9px;border-radius:7px;border:1px solid var(--bd);background:var(--sub);margin-bottom:8px}"
    + ".self-chk{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;cursor:pointer;color:var(--fg)}"
    + ".batch-list{max-height:280px;overflow:auto;border:1px solid var(--bd);border-radius:7px;background:var(--sub);padding:6px 8px;margin-bottom:8px}"
    + ".batch-row{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid var(--bd)}"
    + ".batch-row:last-child{border-bottom:0}"
    + ".b-key{width:96px;flex-shrink:0;font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,monospace;font-size:12px;color:var(--k);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    + ".b-val{flex:1;min-width:0;padding:5px 8px;font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,monospace;font-size:13px;border-radius:6px;border:1px solid var(--bd);background:var(--card);color:var(--fg)}"
    + ".b-chk{display:flex;align-items:center;gap:3px;font-size:12px;color:var(--mut);cursor:pointer;flex-shrink:0}"
    + ".keep-chk{color:var(--acc);font-weight:500}"
    + ".jq-out{width:100%;height:auto;min-height:80px;padding:7px 10px;font-family:ui-monospace,'SFMono-Regular',Menlo,Monaco,'Cascadia Code',Consolas,monospace;font-size:16px;border-radius:7px;border:1px solid var(--bd);background:var(--sub);color:var(--fg);margin-bottom:8px}"
    + ".modal-btns{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}"
    + "@media(max-width:600px){.modal-card{max-width:94vw;max-height:84vh;padding:12px}.batch-list{max-height:175px}.jq-out{min-height:68px}.b-key{width:76px}}"
    + LT + "/style" + GT;

  var fullHtml = headHtml + styleHtml + bodyHtml;

  $done({
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: fullHtml
  });
})();
