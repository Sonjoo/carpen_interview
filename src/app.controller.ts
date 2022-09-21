import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  showApiPage(@Res() res) {
    return res.redirect('/api');
  }
}
