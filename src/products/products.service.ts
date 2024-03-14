import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly producRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.producRepository.create(createProductDto);
      await this.producRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBException(error)
    }


  }

  findAll(paginationDto: PaginationDto) {
    const {limit= 10, offset=0} = paginationDto;
    return this.producRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string) {
    const product = await this.producRepository.findOneBy({ id });
    if (!product) throw new NotFoundException("Product with id not found ")
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return await this.producRepository.remove(product);

  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error);
    throw new InternalServerErrorException("Help!")
  }
}
