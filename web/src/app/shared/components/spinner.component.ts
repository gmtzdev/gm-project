import { Component, inject } from "@angular/core";
import { SpinnerService } from "../services/global/spinner.service";

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [],
    template: `
        @if(isLoading()){
            <div class="overlay">
                <div>
                    <div>

                    </div>
                </div>
            </div>
        }
        
    `
})
export default class SpinnerComponent {
    private readonly spinnerService = inject(SpinnerService);
    isLoading = this.spinnerService.isLoading;
}