
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'handlebars');
    // Add more exclusions for genkit dependencies
    config.externals.push(
      '@grpc/grpc-js',
      '@opentelemetry/exporter-jaeger',
      '@opentelemetry/exporter-trace-otlp-grpc',
      '@opentelemetry/sdk-node',
      'dns'
    );
    return config;
  },
};

export default nextConfig;
