import { Component } from '@angular/core';
import { ClrFormLayouts } from '@ng-holistic/clr-forms';
import { TextMask } from '@ng-holistic/clr-controls';
import { map } from 'rxjs/operators';
import { FormGroup, Validators } from '@angular/forms';
import { propChanged } from '@ng-holistic/forms';
import { BehaviorSubject, merge, Observable } from 'rxjs';

const definition = (hide$: Observable<boolean>) => (form: FormGroup): ClrFormLayouts.ClrFormLayout => ({
    kind: 'tabs',
    $content: [
        {
            kind: 'tab',
            title: 'Personal Info',
            $content: [
                {
                    kind: 'fields',
                    fields: [
                        {
                            id: 'select',
                            kind: 'SelectField',
                            props: {
                                label: 'Select',
                                items: [
                                    { key: '4', label: 'hide first name' },
                                    { key: '0', label: 'hide family group' },
                                    { key: '3', label: 'hide job group' },
                                    { key: '1', label: 'hide address group' },
                                    { key: '2', label: 'hide custom' }
                                ]
                            }
                        },
                        {
                            id: 'custom',
                            kind: 'CustomField',
                            hidden: form.valueChanges.pipe(map(({ select }) => select === '2'))
                        }
                    ]
                },
                {
                    kind: 'group',
                    title: 'Person Name',
                    $content: [
                        {
                            kind: 'fields',
                            fields: [
                                {
                                    kind: 'TextField',
                                    id: 'firstName',
                                    label: 'First Name',
                                    hidden: form.valueChanges.pipe(map(({ select }) => select === '4'))
                                },
                                {
                                    kind: 'TextField',
                                    id: 'lastName',
                                    label: 'Last Name'
                                }
                            ]
                        }
                    ]
                },
                {
                    kind: 'group',
                    title: 'Family',
                    $hidden: form.valueChanges.pipe(map(({ select }) => select === '0')),
                    $content: [
                        {
                            kind: 'fields',
                            fields: [
                                {
                                    kind: 'SelectField',
                                    id: 'maritalStatus',
                                    props: {
                                        label: 'Marital Status',
                                        items: [
                                            { key: 'single', label: 'Single' },
                                            { key: 'married', label: 'Married' }
                                        ]
                                    }
                                },
                                {
                                    kind: 'SelectField',
                                    id: 'childrenNumber',
                                    props: {
                                        label: 'Children Number',
                                        items: [
                                            { key: '1', label: '1' },
                                            { key: '2', label: '2' },
                                            { key: '3', label: '3' },
                                            { key: '3+', label: '3+' }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    kind: 'group',
                    title: 'Job',
                    $hidden: form.valueChanges.pipe(map(({ select }) => select === '3')),
                    $content: [
                        {
                            kind: 'fields',
                            fields: [
                                {
                                    kind: 'TextField',
                                    id: 'occupation',
                                    label: 'Occupation'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            kind: 'tab',
            title: 'Address',
            $hidden: merge(
                hide$,
                form.valueChanges.pipe(
                    propChanged('select'),
                    map(select => select === '1')
                )
            ),
            $content: [
                {
                    kind: 'fields',
                    fields: [
                        {
                            kind: 'TextField',
                            id: 'country',
                            label: 'Country'
                        },
                        {
                            kind: 'TextField',
                            id: 'city',
                            label: 'City'
                        },
                        {
                            kind: 'TextField',
                            id: 'street',
                            label: 'Street'
                        }
                    ]
                }
            ]
        }
    ]
});

@Component({
  selector: 'my-app',
  template: `
  <button (click)="onHide()">Hide Address</button>
  <hlc-clr-form [definition]="definition">
    <ng-template hlcCustomField="custom"> I'm custom </ng-template>
  </hlc-clr-form>`
})
export class AppComponent {
    hide$ = new BehaviorSubject(false);
    definition = definition(this.hide$);

    constructor() {}

    onHide() {
        this.hide$.next(true);
    }

}
