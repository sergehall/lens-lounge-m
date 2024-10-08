import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerBlogsRepo } from '../../../blogger-blogs/infrastructure/blogger-blogs.repo';
import { BlogsCountBlogsDto } from '../../../blogger-blogs/dto/blogs-count-blogs.dto';
import { SaService } from '../sa.service';
import { SaBloggerBlogsViewModel } from '../../views/sa-blogger-blogs.view-model';
import { ParseQueriesDto } from '../../../../../../../libs/common/src/query/dto/parse-queries.dto';
import { PaginatorDto } from '../../../../../../../libs/common/src/helpers/paginator.dto';

export class SaFindBlogsCommand {
  constructor(public queryData: ParseQueriesDto) {}
}

@CommandHandler(SaFindBlogsCommand)
export class SaFindBlogsUseCase implements ICommandHandler<SaFindBlogsCommand> {
  constructor(
    protected bloggerBlogsRepo: BloggerBlogsRepo,
    protected saService: SaService,
  ) {}
  async execute(command: SaFindBlogsCommand): Promise<PaginatorDto> {
    const { queryData } = command;
    const { pageNumber, pageSize } = queryData.queryPagination;

    const blogsAndCount: BlogsCountBlogsDto =
      await this.bloggerBlogsRepo.getBlogsSa(queryData);

    const { blogs, countBlogs } = blogsAndCount;

    if (countBlogs === 0) {
      return {
        pagesCount: 0,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: 0,
        items: [],
      };
    }

    const transformedBlogs: SaBloggerBlogsViewModel[] =
      await this.saService.transformBlogsForSa(blogs);

    const totalCount = blogsAndCount.countBlogs;

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: transformedBlogs,
    };
  }
}
