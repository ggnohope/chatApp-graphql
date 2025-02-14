import { Logger } from '@nestjs/common';
import { Abstract } from './abstract.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<T extends Abstract> {
  protected readonly logger: Logger;

  constructor(public readonly model: Model<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  async create(document: Omit<T, '_id'>): Promise<T> {
    try {
      const newDocument = new this.model({
        _id: new Types.ObjectId(),
        ...document,
      });
      const savedDocument = await newDocument.save();
      return savedDocument.toObject() as T;
    } catch (error) {
      this.logger.error(
        `Failed to create document: ${error.message}`,
        error.stack,
      );
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    try {
      const document = await this.model.findOne(
        filterQuery,
        {},
        { lean: true },
      );

      if (!document) {
        this.logger.warn(
          `Document not found with query: ${JSON.stringify(filterQuery)}`,
        );
      }

      return document as T;
    } catch (error) {
      this.logger.error(
        `Failed to find document with query: ${JSON.stringify(filterQuery)} - ${error.message}`,
        error.stack,
      );
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null> {
    try {
      const document = await this.model.findOneAndUpdate(
        filterQuery,
        updateQuery,
        { lean: true, new: true },
      );

      if (!document) {
        this.logger.warn(
          `Document not found with query: ${JSON.stringify(filterQuery)}`,
        );
      }

      return document as T | null;
    } catch (error) {
      this.logger.error(
        `Failed to update document with query: ${JSON.stringify(filterQuery)} - ${error.message}`,
        error.stack,
      );
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async findAll(filterQuery: FilterQuery<T>): Promise<T[]> {
    try {
      const documents = await this.model.find(filterQuery, {}, { lean: true });

      if (!documents.length) {
        this.logger.warn(
          `No documents found with query: ${JSON.stringify(filterQuery)}`,
        );
      }

      return documents as T[];
    } catch (error) {
      this.logger.error(
        `Failed to find all documents with query: ${JSON.stringify(filterQuery)} - ${error.message}`,
        error.stack,
      );
      throw new Error(`Error finding all documents: ${error.message}`);
    }
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findOneAndDelete(filterQuery, {
        lean: true,
      });

      if (!document) {
        this.logger.warn(
          `Document not found for deletion with query: ${JSON.stringify(filterQuery)}`,
        );
      }

      return document as T | null;
    } catch (error) {
      this.logger.error(
        `Failed to find and delete document with query: ${JSON.stringify(filterQuery)} - ${error.message}`,
        error.stack,
      );
      throw new Error(`Error finding and deleting document: ${error.message}`);
    }
  }
}
