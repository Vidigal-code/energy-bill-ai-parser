import { Logger } from '@nestjs/common';

type BaseHttpLogInput = {
  path: string;
  method?: string;
};

type SuccessLogInput = BaseHttpLogInput;

type ErrorLogInput = BaseHttpLogInput & {
  statusCode: number;
  message: string | string[];
  error?: unknown;
};

type InfoLogInput = {
  context?: string;
  message: string;
};

type WarningLogInput = {
  context?: string;
  message: string;
};

type LogLogInput = {
  context?: string;
  message: string;
};

export class ApiLogger {
  private static readonly logger = new Logger('ApiLogger');
  private static readonly colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
  } as const;

  private static logsEnabled(): boolean {
    return process.env.LOGS?.toLowerCase() !== 'false';
  }

  private static colorize(level: string, color: string): string {
    return `${color}${level}${this.colors.reset}`;
  }

  private static buildContext(context?: string): string {
    return context ? ` [${context}]` : '';
  }

  static log(input: LogLogInput): void {
    if (!this.logsEnabled()) {
      return;
    }

    this.logger.log(
      `${this.colorize('[LOG]', this.colors.blue)}${this.buildContext(input.context)} ${input.message}`,
    );
  }

  static info(input: InfoLogInput): void {
    if (!this.logsEnabled()) {
      return;
    }

    this.logger.log(
      `${this.colorize('[INFO]', this.colors.cyan)}${this.buildContext(input.context)} ${input.message}`,
    );
  }

  static warning(input: WarningLogInput): void {
    if (!this.logsEnabled()) {
      return;
    }

    this.logger.warn(
      `${this.colorize('[WARNING]', this.colors.yellow)}${this.buildContext(input.context)} ${input.message}`,
    );
  }

  static logSuccess(input: SuccessLogInput): void {
    if (!this.logsEnabled()) {
      return;
    }

    const method = input.method ?? 'UNKNOWN';
    this.logger.log(
      `${this.colorize('[SUCCESS]', this.colors.green)} ${method} ${input.path}`,
    );
  }

  static logError(input: ErrorLogInput): void {
    if (!this.logsEnabled()) {
      return;
    }

    const method = input.method ?? 'UNKNOWN';
    const message = Array.isArray(input.message)
      ? input.message.join(', ')
      : input.message;

    this.logger.error(
      `${this.colorize('[ERROR]', this.colors.red)} ${method} ${input.path} ${input.statusCode} - ${message}`,
    );

    if (input.error) {
      this.logger.error(input.error);
    }
  }
}
