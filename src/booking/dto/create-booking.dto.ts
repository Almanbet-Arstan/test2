export class CreateBookingDto {
  readonly carId: number;
  readonly userId: number;
  readonly startDate: string;
  readonly endDate: string;
}
