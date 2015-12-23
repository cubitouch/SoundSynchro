/* CodeFluent Generated Tuesday, 22 December 2015 14:46. TargetVersion:Sql2008, Sql2012, Sql2014, SqlAzure. Culture:fr-FR. UiCulture:fr-FR. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'FUNCTION' AND ROUTINE_NAME = 'cf_quotename')
DROP FUNCTION [dbo].[cf_quotename]
GO
CREATE FUNCTION [dbo].[cf_quotename](@s nvarchar(max)) RETURNS nvarchar(max) AS
BEGIN
  DECLARE @r nvarchar(max), @c  char(1)
  SELECT @c = ''''
  SELECT @r = replace(@s, @c, @c + @c)
  RETURN (@c + @r + @c)
END
GO

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'FUNCTION' AND ROUTINE_NAME = 'cf_SplitString')
DROP FUNCTION [dbo].[cf_SplitString]
GO
CREATE FUNCTION [dbo].[cf_SplitString](@s nvarchar(max), @c nchar) RETURNS @t TABLE (Item nvarchar(max)) AS
BEGIN
  IF @s IS NULL RETURN
  DECLARE @p int, @current int
  SET @current = 1
  WHILE (1 = 1)
  BEGIN
      SET @p = charindex(@c, @s, @current)
      IF (@p = 0)
      BEGIN
          IF ((LEN(@s) - @current + 1) > 0)
          BEGIN
              INSERT INTO @t VALUES(substring(@s, @current, LEN(@s) - @current + 1))
          END
          RETURN
      END
      ELSE
      BEGIN
          INSERT INTO @t VALUES(substring(@s, @current, @p - @current))
          SET @current = @p + 1
      END
  END
  RETURN
END
GO

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'FUNCTION' AND ROUTINE_NAME = 'cf_modelVersion')
DROP FUNCTION [dbo].[cf_modelVersion]
GO
CREATE FUNCTION [dbo].[cf_modelVersion]() RETURNS int AS
BEGIN
  RETURN -101256152
END
GO

