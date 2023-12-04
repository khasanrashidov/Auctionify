import { Component, OnInit, Inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { BidDto, Client } from 'src/app/web-api-client';

@Component({
    selector: 'app-add-bid',
    templateUrl: './add-bid.component.html',
    styleUrls: ['./add-bid.component.scss'],
})
export class AddBidComponent implements OnInit {
    bidForm!: FormGroup;
    lotId!: number;
    bidCount!: number;
    currency!: string;
    startingPrice!: number;
    bids: BidDto[] = [];
    errorMessage!: string;

    constructor(
        private dialogRef: DialogRef<AddBidComponent>,
        private apiClient: Client,
        @Inject(DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    ) {
        this.lotId = this.data?.lotId;
        this.bidCount = this.data?.bidCount;
        this.currency = this.data?.currency;
        this.startingPrice = this.data?.startingPrice;
        console.log('Lot id:', this.lotId);
        console.log('Bid count:', this.bidCount);
        console.log('Currency:', this.currency);
        console.log('Starting price:', this.startingPrice);
    }

    ngOnInit() {
        this.bidForm = this.formBuilder.group({
            bid: [null, Validators.required],
        });

        this.getAllBidsForLot();
    }

    onBidInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
    }

    getAllBidsForLot() {
        this.apiClient.getAllBidsOfUserForLot(this.lotId, 0, 3).subscribe({
            next: (bids) => {
                this.bids = bids;
                this.bids.forEach((bid) => {
                    const date = new Date(bid.timeStamp);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', {
                        month: 'long',
                    });
                    const hours = date.getHours();
                    const minutes = date.getMinutes();

                    bid.timeStamp = `${day} ${month}, ${hours}:${
                        minutes < 10 ? '0' + minutes : minutes
                    }`;
                });
                console.log('Bids for lot:', this.bids);
            },
            error: (error) => {
                console.error('Failed to fetch bids:', error);
            },
        });
    }

    onSubmit() {
        if (this.bidForm.valid) {
            const bidData = {
                lotId: this.lotId,
                bid: this.bidForm.value.bid,
            };

            this.apiClient.addBidForLot(bidData).subscribe({
                next: (response) => {
                    console.log(response);
                    this.bidForm.reset();
                    this.errorMessage = '';
                },
                error: (error) => {
                    if (
                        JSON.parse(error) &&
                        JSON.parse(error)?.errors?.length
                    ) {
                        this.errorMessage =
                            JSON.parse(error)?.errors[0]?.ErrorMessage;
                    }
                },
            });
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
