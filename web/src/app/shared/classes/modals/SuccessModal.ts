import Swal from "sweetalert2";

export class SuccessModal {

    static readonly Center = Swal.mixin({
        icon: 'success',
        position: 'center',
        allowOutsideClick: false
    });

    static readonly TopEnd = Swal.mixin({
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        timerProgressBar: true
    });
}