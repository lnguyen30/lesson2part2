import * as Element from './element.js'
export function info(title, body, closeModal){
    if(closeModal) closeModal.hide() // if there's another modal up, then close the modal for another one to appear
    Element.modalInfoboxTitleElement.innerHTML = title;
    Element.modalInfoboxBodyElement.innerHTML = body;
    Element.modalInfobox.show();
}

//disables button after click
export function disableButton(button){
    button.disable = true;
    const label = button.innerHTML;
    button.innerHTML = 'Wait...'
    return label;
}

//enables button
export function enableButton(button, label){
    if(label) button.innerHTML = label;
    button.disable = false;
}
//time delay
export function sleep (ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}