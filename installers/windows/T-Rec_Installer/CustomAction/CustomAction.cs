namespace CustomAction
{
  using System.IO;

  using Microsoft.Deployment.WindowsInstaller;
  using Microsoft.Win32;

  public class CustomActions
  {
    [CustomAction]
    public static ActionResult RegistryAutorun(Session session)
    {
      CustomActionData customActionData = session.CustomActionData;

      string autorunFlag = customActionData["AUTORUN"];
      string path = customActionData["INSTALLFOLDER"] + "\\T-Rec.exe";

      if (autorunFlag == "1")
      {
        var registryKey = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
        registryKey.SetValue("T_Rec", path);
        registryKey.Close();
      }

      return ActionResult.Success;
    }
  }
}
