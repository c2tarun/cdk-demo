#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { RandomQuoteStack } from '../lib/random_quote-stack';

const app = new cdk.App();
new RandomQuoteStack(app, 'RandomQuoteStack');
app.run();
