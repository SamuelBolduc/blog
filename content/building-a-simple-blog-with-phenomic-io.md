---
title: Building a simple blog with Phenomic.io
date: 2017-05-23
layout: Post
hero: /assets/building-a-simple-blog-with-phenomic-io/phenomic-2560px.jpg
---

# Introduction

So a while ago (back in *2014*) I set up a quick Wordpress blog. I wrote one post and promptly forgot about it. More recently, I had to deal with quite a few challenges for work, and thought it would be a good idea to write an article or two about some of the things I learned from it. So I went back to my old *wp-admin* directory and started to write.

But I quickly realized I was in a much different situation in 2017 compared to when I launched my blog in 2014. In these last three years I worked almost exclusively with Node.js on the backend and cutting-edge frameworks and libraries on the frontend. Going back to the the good old Wordpress felt kind of wrong. Don't get me wrong, Wordpress is still very good at what it does, but I wanted something more in line with the stack I'm using day-to-day.

I looked around for a good static website generator who supports writing posts in Markdown, and stumbled upon [Phenomic.io](https://phenomic.io). It was pretty much what I was looking for.

- Built on top of [React.js](https://facebook.github.io/react/)
- Uses [Webpack](https://webpack.github.io/) for bundling and building the app
- Supports Markdown by default
- Easily extensible
- Lightweight

Looks pretty good, right? Let's try it!

# Setting up Phenomic

Getting up and running with Phenomic is incredibly simple. [The instructions on their site](https://phenomic.io/docs/setup/) are very clear and short, but I will still show it here so the blog post is complete by itself.

> The following instructions have been tested only on Mac OSX

First, create a new directory where you will setup your project.

```bash
mkdir my-phenomic-blog && cd my-phenomic-blog
mkdir node_modules
```

Then, install Phenomic and launch the setup wizard (follow the instructions on the screen).

```bash
yarn add phenomic && ./node_modules/.bin/phenomic setup
```

Finally, install all the dependencies required to run the website, and start the development environment.

```bash
yarn install && yarn start
```

Your new blog should now be available by default at [localhost:3333](http://localhost:3333). This url should open automatically in your browser when Webpack is done building.

![Default Phenomic home page](/assets/building-a-simple-blog-with-phenomic-io/phenomic-900px-optimized.png)

# Customizing Phenomic

Now that the website is running with some sample content and the default phenomic theme, you probably want to customize it a bit. Here are a few things noteworthy.

## Changing the color palette

To change the default colors of the theme, open **postcss.config.js**, located at the root of your project, in your favorite text editor. You can quickly find the color variables.

```javascript
variables: {
  maxWidth: "60rem",
  colorPrimaryDark: "#107491",
  colorPrimary: "#007acc",
  colorSecondaryDark: "#22846C",
  colorSecondary: "#46BE77",
  colorNeutralDark: "#111",
  colorNeutral: "#8C8D91",
  colorNeutralLight: "#FBFCFC",
  colorText: "#555",
},
```

Change the colors to your liking. I'm personnally a *very* bad designer so I used [Coolors](https://coolors.co/app) to get some inspiration, but many other tools exist for this purpose.

## Set your structure

I spent some time wondering why my posts URLs had a **posts/** prefix. Turned out it's pretty simple and obvious: the folder structure in the **content** directory directly dictates the structure of your URLs. So if I create a directory called *essays* and put a file called **my-awesome-essay.md** in there, it will generate a post at the URL **http://example.com/essays/my-awesome-essay/**. This, of course, is clearly stated [in the documentation](https://phenomic.io/docs/getting-started/#where-can-i-find-my-new-page), but as always I tried to put the horse before the cart 🐴

## Optimize your assets

You should try to optimize your assets a bit before going live.

### CSS

I was testing the generated code with Google's [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) and it appears Phenomic does not compress CSS by default. This can be easily fixed. First, install [cssnano](http://cssnano.co/) as a dev dependency.

```bash
yarn add cssnano --dev
```

Then, edit your **postcss.config.js** file. After the `postcss-cssnext` plugin, add this : `require('cssnano')({autoprefixer: false}),`. This will enable cssnano, while disabling its `autoprefixer` feature, since it's already being taken care of by the `postcss-cssnext` plugin. 

Optionally, pass this to the `postcss-reporter` plugin options: `{plugins: ['!postcss-discard-empty']}`. This tells it to ignore `postcss-discard-empty` warnings, which are pretty much useless and just annoying (see https://github.com/ben-eb/cssnano/issues/212).

## Create your content

This is the part where I let you alone! Go ahead and create a few more pages, customize your error pages and create a few posts. It's super easy, and with the hot reload working very well, you can write your code in Markdown on one screen and see the result live on the second screen (if you have a multi-monitor setup). Pretty awesome.

# Saving and building your blog

A static website like this is very easy to manage with Git. As time passes, you write more and more posts, and edit old ones to keep them up to date with edit notes. All of this is saved, with version history, in Git. Then, when you want to publish your changes to your public blog, you build it and deploy it.

## Save to Git

First, head over to Github and create a new repository. 

![Creating a Github repository](/assets/building-a-simple-blog-with-phenomic-io/github-create-repository.png)

Then, in your terminal at the root of your project, initialize your local git repository and push it.

```bash
git init
git add .
git commit -m "Initial commit 🚀"
git remote add origin git@github.com:[your-user]/[your-repo].git
git push -u origin master
```

It's done! Now, every time you add a post or edit your blog, you push it to your git repository. However, your blog is not quite static yet.

## Building your blog

To generate a truly static bundle of your blog, simply execute the `build` command in your project root directory.

```bash
yarn run build
```

This will build the app for publishing and save it in the **dist** directory. It contains all the files you want to upload to Github Pages, or Amazon S3, or any other static site hoster.

# Wrapping it up

In this post I showed you how quick it was to create a static blog using Phenomic, a website generator leveraging modern web technologies to provide a simple and fast experience to your blog visitors. For what I use it for, it's much better than the Wordpress installation I had before.

## Going a step further

In my next blog post I will show you how to automate the deployment of your blog and updates to AWS to get a highly scalable and higly available blog served by a blazing fast CDN, and all that for a ridiculously low cost.
