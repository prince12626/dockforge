export async function requireSubscription(req, res, next) {
      const subscription = await getUserSubscription(req.user.id);

      if (!subscription) {
            return res.status(403).json({
                  message: "Please choose a plan",
            });
      }

      next();
}
