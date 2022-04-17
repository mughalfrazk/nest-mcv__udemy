import { Expose, Transform } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: number;

  @Expose()
  model: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}