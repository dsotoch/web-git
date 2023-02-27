function showSuccessToast(texto) {
    resetToastPosition();
    $.toast({
        heading: 'Success',
        text: texto,
        showHideTransition: 'slide',
        icon: 'success',
        loaderBg: '#f96868',
        position: 'top-right'
    })
};

function showInfoToast(texto) {
    'use strict';
    resetToastPosition();
    $.toast({
        heading: 'Info',
        text: texto,
        showHideTransition: 'slide',
        icon: 'info',
        loaderBg: '#46c35f',
        position: 'top-right'
    })
};

function showWarningToast(texto) {
    'use strict';
    resetToastPosition();
    $.toast({
        heading: 'Warning',
        text: texto,
        showHideTransition: 'slide',
        icon: 'warning',
        loaderBg: '#57c7d4',
        position: 'top-right'
    })
};

function showDangerToast(texto) {
    'use strict';
    resetToastPosition();
    $.toast({
        heading: 'Danger',
        text: texto,
        showHideTransition: 'slide',
        icon: 'error',
        loaderBg: '#f2a654',
        position: 'top-right'
    })
};

function resetToastPosition() {
    $('.jq-toast-wrap').removeClass('bottom-left bottom-right top-left top-right mid-center'); // to remove previous position class
    $(".jq-toast-wrap").css({
        "top": "",
        "left": "",
        "bottom": "",
        "right": ""
    }); //to remove previous position style

};
export { showDangerToast }
export { showWarningToast }
export{showSuccessToast}