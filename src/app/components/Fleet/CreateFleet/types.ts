export type ConfigTemplate = {
  type: 'git' | 'kube' | 'inline';
  name: string;
};

export type GitConfigTemplate = ConfigTemplate & {
  type: 'git';
  repoURL: string;
  targetRevision: string;
  path: string;
};

export type KubeSecretTemplate = ConfigTemplate & {
  type: 'kube';
  secretName: string;
  secretNs: string;
  mountPath: string;
};

export type InlineConfigTemplate = ConfigTemplate & {
  type: 'inline';
  inline: string;
};

export type FleetFormValues = {
  name: string;
  osImage: string;
  labels: { key: string; value: string }[];
  configTemplates: (GitConfigTemplate | KubeSecretTemplate | InlineConfigTemplate)[];
};
