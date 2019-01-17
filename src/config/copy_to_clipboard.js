const copyToClipboard = query => {
  const link = `${window.location.origin}/#${encodeURI(query)}`;
  let copySuccess = false;

  if (document.execCommand) {
    let text = document.createElement('textarea');
    text.value = link;
    text.setAttribute("readonly", "");
    text.style = {position: "absolute", width: 0, height: 0, opacity: 0};
    document.body.appendChild(text);
    text.select();
    if (document.execCommand("copy")) copySuccess = true;
    document.body.removeChild(text);
  }

  if (copySuccess) {
    alert("Successfully copied link to clipboard!");
  } else {
    prompt("Copy this link:", link);
  }
}

export default copyToClipboard;