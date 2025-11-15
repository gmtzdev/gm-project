import Swal from "sweetalert2";

export class ErrorModal {

    static readonly Center = Swal.mixin({
        icon: 'error',
        position: 'center',
        allowOutsideClick: false
    });

    static readonly TopEnd = Swal.mixin({
        icon: 'error',
        position: 'top-end',
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        timerProgressBar: true
    });
}