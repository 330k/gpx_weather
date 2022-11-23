// ドラッグドロップ対応
function addDropArea(droparea, target){
  const overlay = document.createElement("div");
    
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "9998";
    overlay.style.backgroundColor = "#ddd";
    overlay.style.opacity = "0.5";
    overlay.style.display = "none";
    
    droparea.appendChild(overlay);
    droparea.addEventListener("dragover", function(e){
      e.stopPropagation();
      e.preventDefault();
      overlay.style.display = "block";
    }, false);
    overlay.addEventListener("dragleave", function(e){
      e.stopPropagation();
      e.preventDefault();
      overlay.style.display = "none";
    }, false);
    overlay.addEventListener("drop", function(e){
      e.stopPropagation();
      e.preventDefault();
      overlay.style.display = "none";
      
      target.files = e.dataTransfer.files;

      target.dispatchEvent(new Event("change"));
    }, false);
  }

// ドラッグドロップ失敗時にファイルがダウンロードされるのを防止
window.addEventListener("dragover", function(e){
  e = e || event;
  e.preventDefault();
}, false);
window.addEventListener("drop", function(e){
  e = e || event;
  e.preventDefault();
}, false);
