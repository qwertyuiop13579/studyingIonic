export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeTitle: string,
    public placeDescription: string,
    public firstName: string,
    public lastName: string,
    public guestNumber: number,
    public placeImageURL: string,
    public locationImageURL: string,
    public dateFrom: Date,
    public dateTo: Date,
  ) { }
}
