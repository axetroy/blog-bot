module.exports = robot => {
  robot.on("issues.opened", async context => {
    const { issue } = context.payload;

    // if not owner open an issue and not a bot
    if (issue.author_association !== "OWNER" && !context.isBot) {
      const config = await context.config("blog-bot.yml", {
        replyContent: `非常荣幸您能够来这里留言。

**本仓库仅提供作者发布文章使用**，请到文章中留言。

您的 issue 将会被关闭和锁定。

---- 来自 Axetroy 的机器人
              `
      });
      // comment issue
      await context.github.issues.createComment(
        context.issue({
          body: config.replyContent
        })
      );

      // close issue
      await context.github.issues.edit(
        context.issue({
          state: "closed"
        })
      );

      // lock issue
      await context.github.issues.lock(context.issue());
    }
  });
};
