import {TestBed, async, inject, ComponentFixture} from "@angular/core/testing";
import {Type, DebugElement} from "@angular/core";
import {ReactiveFormsModule, FormGroup, FormControl} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {InputsModule} from "@progress/kendo-angular-inputs";
import {
    DynamicFormsCoreModule,
    DynamicFormService,
    DynamicSwitchModel,
    DynamicFormControlModel
} from "@ng2-dynamic-forms/core";
import {DynamicFormKendoComponent, DYNAMIC_FORM_UI_KENDO} from "./dynamic-form-kendo.component";

describe("DynamicFormKendoComponent test suite", () => {

    let switchModel = new DynamicSwitchModel({id: "test"}),
        formModel = [switchModel],
        formGroup: FormGroup,
        fixture: ComponentFixture<DynamicFormKendoComponent>,
        component: DynamicFormKendoComponent,
        debugElement: DebugElement,
        switchElement: DebugElement;

    beforeEach(async(() => {

        TestBed.configureTestingModule({

            imports: [
                ReactiveFormsModule,
                DropDownsModule,
                InputsModule,
                DynamicFormsCoreModule.forRoot()
            ],
            declarations: [DynamicFormKendoComponent]

        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(DynamicFormKendoComponent as Type<DynamicFormKendoComponent>);

            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });
    }));

    beforeEach(inject([DynamicFormService], service => {

        formGroup = service.createFormGroup(formModel);

        component.controlGroup = formGroup;
        component.model = formModel[0];

        fixture.detectChanges();

        switchElement = debugElement.query(By.css(`kendo-switch`));
    }));

    it("should initialize correctly", () => {

        expect(component.type).toEqual(DYNAMIC_FORM_UI_KENDO);

        expect(component.control instanceof FormControl).toBe(true);
        expect(component.controlGroup instanceof FormGroup).toBe(true);
        expect(component.model instanceof DynamicFormControlModel).toBe(true);
        expect(component.hasErrorMessaging).toBe(false);

        expect(component.onControlValueChanges).toBeDefined();
        expect(component.onModelDisabledUpdates).toBeDefined();
        expect(component.onModelValueUpdates).toBeDefined();

        expect(component.blur).toBeDefined();
        expect(component.change).toBeDefined();
        expect(component.focus).toBeDefined();

        expect(component.onValueChange).toBeDefined();
        expect(component.onFocusChange).toBeDefined();

        expect(component.isValid).toBe(true);
        expect(component.isInvalid).toBe(false);
    });

    it("should have an input element", () => {

        expect(switchElement instanceof DebugElement).toBe(true);
    });

    xit("should listen to native focus and blur events", () => {

        spyOn(component, "onFocusChange");

        switchElement.triggerEventHandler("focus", null);
        switchElement.triggerEventHandler("blur", null);

        expect(component.onFocusChange).toHaveBeenCalledTimes(2);
    });

    it("should listen to native change event", () => {

        spyOn(component, "onValueChange");

        switchElement.triggerEventHandler("valueChange", null);

        expect(component.onValueChange).toHaveBeenCalled();
    });

    it("should update model value when control value changes", () => {

        spyOn(component, "onControlValueChanges");

        component.ngOnInit();

        component.control.setValue("test");

        expect(component.onControlValueChanges).toHaveBeenCalled();
    });

    it("should update control value when model value changes", () => {

        spyOn(component, "onModelValueUpdates");

        component.ngOnInit();

        switchModel.valueUpdates.next(true);

        expect(component.onModelValueUpdates).toHaveBeenCalled();
    });

    it("should update control activation when model disabled property changes", () => {

        spyOn(component, "onModelDisabledUpdates");

        component.ngOnInit();

        switchModel.disabledUpdates.next(true);

        expect(component.onModelDisabledUpdates).toHaveBeenCalled();
    });
});