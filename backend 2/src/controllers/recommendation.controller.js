import { prisma } from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const parseTags = (value) => {
  if (!value) return [];
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const mapItem = (item) => ({
  ...item,
  tags: parseTags(item.tags),
});

const DEFAULT_RECOMMENDATIONS = [
  {
    title: 'Курсы по технологиям',
    icon: '💻',
    sortOrder: 1,
    items: [
      {
        title: 'React Basics',
        description: 'Официальный интерактивный курс по React для начинающих.',
        url: 'https://react.dev/learn',
        tags: ['React', 'Frontend', 'Beginner'],
        isFree: true,
        sortOrder: 1,
      },
      {
        title: 'Node.js Crash Course',
        description: 'Быстрый практический курс по Node.js и Express.',
        url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
        tags: ['Node.js', 'Backend', 'Beginner'],
        isFree: true,
        sortOrder: 2,
      },
      {
        title: 'DevOps Roadmap',
        description: 'Пошаговый план развития в DevOps.',
        url: 'https://roadmap.sh/devops',
        tags: ['DevOps', 'Roadmap'],
        isFree: true,
        sortOrder: 3,
      },
    ],
  },
  {
    title: 'Карьерные советы',
    icon: '📈',
    sortOrder: 2,
    items: [
      {
        title: 'Как составить сильное резюме в IT',
        description: 'Практические рекомендации по структуре и содержанию резюме.',
        url: 'https://www.freecodecamp.org/news/how-to-write-a-software-developer-resume/',
        tags: ['Resume', 'Career'],
        isFree: true,
        sortOrder: 1,
      },
      {
        title: 'Подготовка к техническому интервью',
        description: 'Чеклист подготовки и типовые вопросы на интервью.',
        url: 'https://www.interviewbit.com/',
        tags: ['Interview', 'Career'],
        isFree: true,
        sortOrder: 2,
      },
    ],
  },
  {
    title: 'Книги и медиа',
    icon: '📚',
    sortOrder: 3,
    items: [
      {
        title: 'Clean Code',
        description: 'Классика по качеству кода и профессиональным практикам.',
        url: 'https://www.goodreads.com/book/show/3735293-clean-code',
        tags: ['Book', 'Engineering'],
        isFree: false,
        sortOrder: 1,
      },
      {
        title: 'System Design Primer',
        description: 'Подборка материалов по системному дизайну.',
        url: 'https://github.com/donnemartin/system-design-primer',
        tags: ['System Design', 'Architecture'],
        isFree: true,
        sortOrder: 2,
      },
      {
        title: 'Подборка YouTube-каналов для разработчиков',
        description: 'Полезные каналы по frontend, backend и soft skills.',
        url: 'https://www.youtube.com/results?search_query=software+engineering+career',
        tags: ['YouTube', 'Learning'],
        isFree: true,
        sortOrder: 3,
      },
    ],
  },
];

const seedRecommendationsIfEmpty = async () => {
  const count = await prisma.recommendationCategory.count();
  if (count > 0) return;

  await prisma.$transaction(
    DEFAULT_RECOMMENDATIONS.map((category) =>
      prisma.recommendationCategory.create({
        data: {
          title: category.title,
          icon: category.icon,
          sortOrder: category.sortOrder,
          isActive: true,
          items: {
            create: category.items.map((item) => ({
              title: item.title,
              description: item.description,
              url: item.url,
              tags: JSON.stringify(item.tags),
              isFree: item.isFree,
              sortOrder: item.sortOrder,
              isActive: true,
            })),
          },
        },
      })
    )
  );
};

export const getRecommendations = async (_req, res) => {
  try {
    await seedRecommendationsIfEmpty();

    const categories = await prisma.recommendationCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    const normalized = categories.map((category) => ({
      ...category,
      items: category.items.map(mapItem),
    }));

    return res.json(successResponse(normalized));
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json(errorResponse('Failed to fetch recommendations'));
  }
};

export const getRecommendationCategoryItems = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (Number.isNaN(categoryId)) {
      return res.status(400).json(errorResponse('Invalid category ID'));
    }

    const category = await prisma.recommendationCategory.findUnique({
      where: { id: categoryId },
      include: {
        items: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    return res.json(
      successResponse({
        ...category,
        items: category.items.map(mapItem),
      })
    );
  } catch (error) {
    console.error('Get category items error:', error);
    return res.status(500).json(errorResponse('Failed to fetch category items'));
  }
};

export const createRecommendationCategory = async (req, res) => {
  try {
    const { title, icon, sortOrder = 0, isActive = true } = req.body;
    if (!title?.trim()) {
      return res.status(400).json(errorResponse('Category title is required'));
    }
    const category = await prisma.recommendationCategory.create({
      data: { title: title.trim(), icon: icon ?? null, sortOrder: Number(sortOrder) || 0, isActive: !!isActive },
    });
    return res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json(errorResponse('Failed to create category'));
  }
};

export const updateRecommendationCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid category ID'));
    }
    const { title, icon, sortOrder, isActive } = req.body;
    const category = await prisma.recommendationCategory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title?.trim() || '' }),
        ...(icon !== undefined && { icon: icon || null }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
    });
    return res.json(successResponse(category, 'Category updated successfully'));
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json(errorResponse('Failed to update category'));
  }
};

export const createRecommendationItem = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      description,
      url,
      imageUrl,
      tags,
      isFree = true,
      sortOrder = 0,
      isActive = true,
    } = req.body;

    if (!categoryId || !title?.trim()) {
      return res.status(400).json(errorResponse('categoryId and title are required'));
    }

    const item = await prisma.recommendationItem.create({
      data: {
        categoryId: Number(categoryId),
        title: title.trim(),
        description: description ?? null,
        url: url ?? null,
        imageUrl: imageUrl ?? null,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : null,
        isFree: !!isFree,
        sortOrder: Number(sortOrder) || 0,
        isActive: !!isActive,
      },
    });

    return res.status(201).json(successResponse(mapItem(item), 'Item created successfully'));
  } catch (error) {
    console.error('Create recommendation item error:', error);
    return res.status(500).json(errorResponse('Failed to create item'));
  }
};

export const updateRecommendationItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid item ID'));
    }

    const { categoryId, title, description, url, imageUrl, tags, isFree, sortOrder, isActive } = req.body;
    const item = await prisma.recommendationItem.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
        ...(title !== undefined && { title: title?.trim() || '' }),
        ...(description !== undefined && { description: description || null }),
        ...(url !== undefined && { url: url || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? JSON.stringify(tags) : null }),
        ...(isFree !== undefined && { isFree: !!isFree }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
    });
    return res.json(successResponse(mapItem(item), 'Item updated successfully'));
  } catch (error) {
    console.error('Update recommendation item error:', error);
    return res.status(500).json(errorResponse('Failed to update item'));
  }
};

export const deleteRecommendationItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid item ID'));
    }
    await prisma.recommendationItem.delete({ where: { id } });
    return res.json(successResponse(null, 'Item deleted successfully'));
  } catch (error) {
    console.error('Delete recommendation item error:', error);
    return res.status(500).json(errorResponse('Failed to delete item'));
  }
};
