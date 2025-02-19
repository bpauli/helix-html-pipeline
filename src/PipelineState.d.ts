/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License; Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing; software distributed under
 * the License is distributed on an "AS IS" BASIS; WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND; either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import {PathInfo, S3Loader, FormsMessageDispatcher, PipelineTimer, AuthEnvLoader } from "./index";
import {PipelineContent} from "./PipelineContent";
import {Modifiers} from './utils/modifiers';
import {ProjectConfig} from "./project-config";

declare enum PipelineType {
  html = 'html',
  json = 'json',
  form = 'form',
}

type Fetch = (url: string|Request, options?: RequestOptions) => Promise<Response>;

declare interface AccessConfig {
  allow:(string|string[]);

  apiKeyId:(string|string[]);

  require: {
    repository:(string|string[]);
  };
}

declare interface PipelineOptions {
  log: Console;
  s3Loader: S3Loader;
  messageDispatcher: FormsMessageDispatcher;
  authEnvLoader: AuthEnvLoader;
  fetch: Fetch;
  owner: string;
  repo: string;
  ref: string;
  partition: string;
  path: string;
  timer: PipelineTimer;
  env: object;
}

declare class PipelineState {
  constructor(opts: PipelineOptions);
  log: Console;
  env: object;
  info: PathInfo;
  content: PipelineContent;
  contentBusId: string;
  s3Loader: S3Loader;
  messageDispatcher: FormsMessageDispatcher;
  authEnvLoader: AuthEnvLoader;
  fetch: Fetch;

  /**
   * Returns the external link representation for authentication related redirects and cookies.
   * This is only used for local testing and is an identity operation in production.
   */
  createExternalLocation(value:string): string;

  /**
   * Content bus partition
   * @example 'live'
   * @example 'preview'
   */
  partition: string;

  /**
   * Repository owner
   */
  owner: string;

  /**
   * Repository name
   */
  repo: string;

  /**
   * Repository ref
   */
  ref: string;

  /**
   * helix-config.json once loaded (contains fstab, head.html, etc)
   */
  helixConfig?: object;

  /**
   * the /.helix/config.json in object form
   */
  config?: ProjectConfig;

  /**
   * the metadata.json in modifier form.
   */
  metadata?: Modifiers;

  /**
   * the headers.json in modifier form.
   */
  headers?: Modifiers;

  /**
   * optional timer that is used to measure the timing
   */
  timer?: PipelineTimer;

  /**
   * pipeline type. 'html', 'json', 'forms'
   */
  type: PipelineType;

  /**
   * Authentication information
   */
  authInfo?: AuthInfo;

  /**
   * the custom preview host if configured via config.cdn.preview.host
   * this is initialized after the config is loaded.
   */
  previewHost?: string;

  /**
   * the custom live host if configured via config.cdn.live.host
   * this is initialized after the config is loaded.
   */
  liveHost?: string;
}

