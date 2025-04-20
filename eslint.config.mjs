import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // 既存のNext.jsやTypeScript拡張設定
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // unused-importsプラグインの設定をFlat Config形式で追加
  {
    plugins: {
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      // 既存の unused-vars を無効化
      '@typescript-eslint/no-unused-vars': 'off',

      // importが使われていない場合の警告
      'unused-imports/no-unused-imports': 'warn',

      // 変数の未使用も警告、ただし _ で始まる変数はスキップ
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
    },
  },
]

export default eslintConfig
