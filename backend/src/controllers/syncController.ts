import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to public folder (relative to backend root)
const PUBLIC_PATH = path.join(__dirname, '../../../../public');
const QUESTIONS_PATH = path.join(PUBLIC_PATH, 'data/questions');
const AUDIO_PATH = path.join(PUBLIC_PATH, 'audio');

/**
 * Get questions metadata (version, lastUpdated, file list)
 */
export async function getQuestionsMetadata(req: Request, res: Response) {
  try {
    const metadata = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalFiles: 0,
      totalSize: 0,
      structure: {} as Record<string, any>,
    };

    // Scan questions directory
    const scanDirectory = async (dirPath: string, relativePath: string = ''): Promise<any> => {
      const entries: any = {};
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

        if (item.isDirectory()) {
          entries[item.name] = await scanDirectory(fullPath, itemRelativePath);
        } else if (item.isFile() && item.name.endsWith('.json')) {
          const stats = await fs.stat(fullPath);
          entries[item.name] = {
            type: 'file',
            size: stats.size,
            modified: stats.mtime.toISOString(),
            path: itemRelativePath,
          };
          metadata.totalFiles++;
          metadata.totalSize += stats.size;
        }
      }

      return entries;
    };

    if (await fs.access(QUESTIONS_PATH).then(() => true).catch(() => false)) {
      metadata.structure = await scanDirectory(QUESTIONS_PATH);
    }

    res.json(metadata);
  } catch (error: any) {
    console.error('Error getting questions metadata:', error);
    res.status(500).json({ error: 'Failed to get questions metadata', message: error.message });
  }
}

/**
 * Get questions by path (bookSeries/grade/subject/week)
 */
export async function getQuestions(req: Request, res: Response) {
  try {
    const { bookSeries, grade, subject, week } = req.query;

    if (!bookSeries || !grade || !subject || !week) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['bookSeries', 'grade', 'subject', 'week'],
      });
    }

    // Build file path: ket-noi-tri-thuc/grade-1/math/week-1.json
    const fileName = `week-${week}.json`;
    const filePath = path.join(
      QUESTIONS_PATH,
      bookSeries as string,
      `grade-${grade}`,
      subject as string,
      fileName
    );

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Questions file not found' });
    }

    // Read and return file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const questions = JSON.parse(fileContent);

    res.json({
      bookSeries,
      grade: parseInt(grade as string),
      subject,
      week: parseInt(week as string),
      questions,
    });
  } catch (error: any) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Failed to get questions', message: error.message });
  }
}

/**
 * List all available questions files
 */
export async function listQuestions(req: Request, res: Response) {
  try {
    const files: Array<{
      bookSeries: string;
      grade: number;
      subject: string;
      week: number;
      path: string;
      size: number;
      modified: string;
    }> = [];

    const scanDirectory = async (dirPath: string, bookSeries: string, grade: number, subject: string) => {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isFile() && item.name.endsWith('.json') && item.name.startsWith('week-')) {
          const week = parseInt(item.name.replace('week-', '').replace('.json', ''));
          const stats = await fs.stat(fullPath);
          const relativePath = path.relative(QUESTIONS_PATH, fullPath).replace(/\\/g, '/');

          files.push({
            bookSeries,
            grade,
            subject,
            week,
            path: relativePath,
            size: stats.size,
            modified: stats.mtime.toISOString(),
          });
        }
      }
    };

    // Scan questions directory structure
    if (await fs.access(QUESTIONS_PATH).then(() => true).catch(() => false)) {
      const bookSeriesDirs = await fs.readdir(QUESTIONS_PATH, { withFileTypes: true });

      for (const bookSeriesDir of bookSeriesDirs) {
        if (!bookSeriesDir.isDirectory()) continue;

        const bookSeriesPath = path.join(QUESTIONS_PATH, bookSeriesDir.name);
        const gradeDirs = await fs.readdir(bookSeriesPath, { withFileTypes: true });

        for (const gradeDir of gradeDirs) {
          if (!gradeDir.isDirectory() || !gradeDir.name.startsWith('grade-')) continue;

          const grade = parseInt(gradeDir.name.replace('grade-', ''));
          const gradePath = path.join(bookSeriesPath, gradeDir.name);
          const subjectDirs = await fs.readdir(gradePath, { withFileTypes: true });

          for (const subjectDir of subjectDirs) {
            if (!subjectDir.isDirectory()) continue;

            const subjectPath = path.join(gradePath, subjectDir.name);
            await scanDirectory(subjectPath, bookSeriesDir.name, grade, subjectDir.name);
          }
        }
      }
    }

    res.json({ files, total: files.length });
  } catch (error: any) {
    console.error('Error listing questions:', error);
    res.status(500).json({ error: 'Failed to list questions', message: error.message });
  }
}

/**
 * Get audio file
 */
export async function getAudio(req: Request, res: Response) {
  try {
    const { filename } = req.params;

    if (!filename || !filename.endsWith('.mp3')) {
      return res.status(400).json({ error: 'Invalid audio filename' });
    }

    const filePath = path.join(AUDIO_PATH, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream file
    const fileContent = await fs.readFile(filePath);
    res.send(fileContent);
  } catch (error: any) {
    console.error('Error getting audio:', error);
    res.status(500).json({ error: 'Failed to get audio', message: error.message });
  }
}

/**
 * List all available audio files
 */
export async function listAudio(req: Request, res: Response) {
  try {
    const files: Array<{
      filename: string;
      size: number;
      modified: string;
    }> = [];

    if (await fs.access(AUDIO_PATH).then(() => true).catch(() => false)) {
      const items = await fs.readdir(AUDIO_PATH, { withFileTypes: true });

      for (const item of items) {
        if (item.isFile() && item.name.endsWith('.mp3')) {
          const fullPath = path.join(AUDIO_PATH, item.name);
          const stats = await fs.stat(fullPath);

          files.push({
            filename: item.name,
            size: stats.size,
            modified: stats.mtime.toISOString(),
          });
        }
      }
    }

    res.json({ files, total: files.length });
  } catch (error: any) {
    console.error('Error listing audio:', error);
    res.status(500).json({ error: 'Failed to list audio', message: error.message });
  }
}

/**
 * Get sync metadata (questions + audio)
 */
export async function getSyncMetadata(req: Request, res: Response) {
  try {
    const questionsMetadata = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalFiles: 0,
      totalSize: 0,
    };

    const audioMetadata = {
      totalFiles: 0,
      totalSize: 0,
      lastUpdated: new Date().toISOString(),
    };

    // Scan questions
    if (await fs.access(QUESTIONS_PATH).then(() => true).catch(() => false)) {
      const scanQuestions = async (dirPath: string): Promise<void> => {
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(dirPath, item.name);

          if (item.isDirectory()) {
            await scanQuestions(fullPath);
          } else if (item.isFile() && item.name.endsWith('.json')) {
            const stats = await fs.stat(fullPath);
            questionsMetadata.totalFiles++;
            questionsMetadata.totalSize += stats.size;
          }
        }
      };

      await scanQuestions(QUESTIONS_PATH);
    }

    // Scan audio
    if (await fs.access(AUDIO_PATH).then(() => true).catch(() => false)) {
      const items = await fs.readdir(AUDIO_PATH, { withFileTypes: true });

      for (const item of items) {
        if (item.isFile() && item.name.endsWith('.mp3')) {
          const fullPath = path.join(AUDIO_PATH, item.name);
          const stats = await fs.stat(fullPath);
          audioMetadata.totalFiles++;
          audioMetadata.totalSize += stats.size;
        }
      }
    }

    res.json({
      questions: questionsMetadata,
      audio: audioMetadata,
      lastSync: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error getting sync metadata:', error);
    res.status(500).json({ error: 'Failed to get sync metadata', message: error.message });
  }
}

