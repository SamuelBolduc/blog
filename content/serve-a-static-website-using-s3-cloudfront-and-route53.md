---
title: Serve a static website using S3, CloudFront and Route53
date: 2018-08-14
layout: Post
hero: /assets/serve-a-static-website-using-s3-cloudfront-and-route53/aws-static-website-architecture-optimized.png
draft: true
---

# Introduction

As I exposed in [my last blog post](/building-a-simple-blog-with-phenomic-io/), I decided to make the move from Wordpress to a static blog, and I chose [Phenomic.io](https://phenomic.io) for this purpose. Once I had my static blog the way I liked it (very little customization, actually!) it was time to host it and make it available to the world. After doing some calculations, I figured hosting it on Amazon would be pretty cheap, and since I'm confortable in the AWS environment I decided to go with them.

# The architecture

At high level, here is what the architecture should end up looking like.

![AWS static website architecture](/assets/serve-a-static-website-using-s3-cloudfront-and-route53/aws-static-website-architecture-optimized.png)

In this blog post, I will focus on the AWS section of that diagram.

## Breakdown of AWS services

To build this cost efficient, simple and highgly available / scalable system, we need to use a few AWS services together.

- Amazon Simple Storage Service (S3): will serve as hosting for our blog;
- Amazon CloudFront: will efficiently serve our files hosted on S3;
- Amazon AWS Certificate Manager (ACM): will issue and manage our free SSL certificate;
- Amazon Route53: will handle domain setup, used to redirect requests to CloudFront.

### AWS S3

To store our files, we need to create an S3 bucket. For this example, let's name it `sambolduc.com-blog-demo` (name must be globally unique across the chosen region). Default options on the next screens should be good.

![S3 screenshot](/assets/serve-a-static-website-using-s3-cloudfront-and-route53/s3-screenshot.png)

To upload content to our bucket, the easiest way is to use the [AWS CLI](https://aws.amazon.com/cli/). In our `dist` directory (after running `yarn run build`), we simply sync the files to our S3 bucket:

```bash
aws s3 sync . s3://sambolduc.com-blog-demo
```

### AWS Route 53

Before going further, we need to set up our domain in AWS.

First, we need to create a hosted zone for our domain name. Once it's created, we need to make sure we set up your domain registrar account to use Amazon nameservers as DNS. We should use the nameservers we see in Route 53 in our hosted zone under the `NS` entry (there should be 4). Once this is done and we can confirm the DNS records have been updated and propagated, we can proceed with the creation of our CloudFront distribution.

### AWS CloudFront

In the left menu, go to "Origin Access Identity". Create a new Origin Access Identity and when asked for a comment (kind of represents the name) put something meaningful, like sambolduc.com-blog-demo. 

Now that we have our Origin Access Identity, we can create our CloudFront distribution (go to Distributions in the menu, click Create New Distribution). Choose Web, then enter your information. 

- For *Origin Domain Name*, select in the dropdown your previously created S3 bucket;
- Leave the next two options to their default;
- For *Restrict Bucket Access* choose "Yes", then choose your previously created Origin Access Identity. For *Grant Read Permissions on Bucket*, choose "Yes, Update Bucket Policy";
- Under *Default Cache Behavior Settings*, set *Viewer Protocol Policy* to "Redirect HTTP to HTTPS" (this will force a secure connection);
- Leave all *Default Cache Behavior Settings* options to their default;
- In *Distribution Settings*, choose your Price Class. The more Edge Locations you use, higher the cost will be. You can refer to the [pricing page](https://aws.amazon.com/cloudfront/pricing/);
- For *Alternate Domain Names (CNAMEs)*, enter the domain name you want to use (or subdomain). For this example we'll name it `blog-demo`;
- For *Default Root Object* enter `index.html` (to tell CloudFront what file to serve when the root is requested);
- Leave the rest as it is, and click *Create Distribution*.

While the dsitribution deployment is still in progress, we can set up our domain name.

## Back to AWS Route 53

We now need to create our subdomain (optional - it's also possible to use the domain directly).

To do so, we click on *Create Record Set*, and name it exactly the same as we chose in the CloudFront settings (leave empty if you want to use your domain name directly). We choose "Yes" for *Alias*, and for Alias Target, we choose our CloudFront distribution from the dropdown. In case it's not available in the dropdown, we can manually enter the url of our CloudFront distribution.

Our domain name should now point to our CloudFront distribution! Yay!

### Enabling HTTPs with AWS ACM

AWS provides a service called AWS Certificate Manager (ACM). Using this service, it's completely free to request an SSL certificate for use within AWS for a domain hosted in Route 53. Luckily for us, we fit the description!

To generate our certificate, we

- Click *Request a certificate*;
- Choose "Request a public certificate";
- Enter our domain or subdomain (blog-demo.sambolduc.com);
- Choose "DNS validation";
- Review and confirm;
- When clicking the little arrow next to the domain name in the confirmation screen, click *Create record in Route 53* and confirm.

![ACM screenshot](/assets/serve-a-static-website-using-s3-cloudfront-and-route53/acm-screenshot.png)

The certificate should status should change from *Pending validation* to *Issued* within 30 minutes.

Once it's issued, we need to go back to our distribution settings in CloudFront and specify the SSL certificate by clicking *Edit* in *General* and choosing "Custom SSL certificate" next to *SSL Certificate*. The dropdown should suggest our newly created certificate. Let's select it, and confirm by clicking *Yes, edit*.

# The final result

If everything has been set up correctly and nothing is pending or not done, we should be able to access our website via the subdomain or domain we chose (https://blog-demo.sambolduc.com in this case).

## Going a step further

In my next blog post, I will show you how to automate your website deployment with Travis-CI.
