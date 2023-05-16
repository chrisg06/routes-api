export class CreateRouteDto {
  readonly dept: string;
  readonly dest: string;
  readonly acft: string;
  readonly route: string;
  readonly notes: string;
}

export class UploadRoutesDto {
  readonly valid: string;
  readonly data: CreateRouteDto[];
}

export class EditRouteDto {
  readonly acft?: string;
  readonly route?: string;
  readonly notes?: string;
}
