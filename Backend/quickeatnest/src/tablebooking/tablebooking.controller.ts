import { Body, Controller, Post } from '@nestjs/common';
import { TablebookingService } from './tablebooking.service';
import { TableBookingDTO } from './dto/tablebook.dto';

@Controller('tablebooking')
export class TablebookingController {
  constructor(private tablebookingservice: TablebookingService) {}

  @Post('/createtablebook')
  createTableBook(@Body() tablebookdto: TableBookingDTO) {
    return this.tablebookingservice.createTableBook(tablebookdto);
  }
}
