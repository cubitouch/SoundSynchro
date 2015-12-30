/* CodeFluent Generated . TargetVersion:Default. Culture:en-US. UiCulture:en-US. Encoding:utf-8 (http://www.softfluent.com) */
set quoted_identifier OFF
GO
IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_Delete]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_Delete]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_DeletePlaylistmusics]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_DeletePlaylistmusics]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_Save]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_Save]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_SavePlaylistmusics]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_SavePlaylistmusics]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_Delete]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Playlist_Delete]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_Save]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Playlist_Save]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_Load]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_Load]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_LoadAll]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_LoadAll]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_LoadByid]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_LoadByid]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_LoadmusicsByPlaylist]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_LoadmusicsByPlaylist]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Music_SearchAll]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Music_SearchAll]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_Load]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Playlist_Load]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_LoadAll]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Playlist_LoadAll]
GO

IF EXISTS (SELECT * FROM [dbo].[sysobjects] WHERE id = object_id(N'[dbo].[Playlist_LoadByid]') AND OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP PROCEDURE [dbo].[Playlist_LoadByid]
GO

CREATE PROCEDURE [dbo].[Music_Delete]
(
 @Music_id [uniqueidentifier],
 @_rowVersion [rowversion]
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
DELETE FROM [Playlist_musics_Music]
    WHERE ([Playlist_musics_Music].[Music_id] = @Music_id)
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
DELETE FROM [Music]
    WHERE (([Music].[Music_id] = @Music_id) AND ([Music].[_rowVersion] = @_rowVersion))
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
IF(@rowcount = 0)
BEGIN
    IF @tran = 1 ROLLBACK TRANSACTION
    RAISERROR (50001, 16, 1, 'Music_Delete')
    RETURN
END
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Music_DeletePlaylistmusics]
(
 @Playlist_id [uniqueidentifier] = NULL,
 @Music_id [uniqueidentifier]
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
DELETE FROM [Playlist_musics_Music]
    WHERE (([Playlist_musics_Music].[Music_id] = @Music_id) AND ([Playlist_musics_Music].[Playlist_id] = @Playlist_id))
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Music_Save]
(
 @Music_id [uniqueidentifier],
 @Music_title [nvarchar] (256) = NULL,
 @Music_file [nvarchar] (256) = NULL,
 @Music_thumbnail [nvarchar] (256) = NULL,
 @Music_date [datetime] = NULL,
 @Music_type [int] = NULL,
 @_rowVersion [rowversion] = NULL
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
IF(@_rowVersion IS NOT NULL)
BEGIN
    UPDATE [Music] SET
     [Music].[Music_title] = @Music_title,
     [Music].[Music_file] = @Music_file,
     [Music].[Music_thumbnail] = @Music_thumbnail,
     [Music].[Music_date] = @Music_date,
     [Music].[Music_type] = @Music_type
        WHERE (([Music].[Music_id] = @Music_id) AND ([Music].[_rowVersion] = @_rowVersion))
    SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
    IF(@error != 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RETURN
    END
    IF(@rowcount = 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RAISERROR (50001, 16, 1, 'Music_Save')
        RETURN
    END
    SELECT DISTINCT [Music].[_rowVersion] 
        FROM [Music]
        WHERE ([Music].[Music_id] = @Music_id)
END
ELSE
BEGIN
    INSERT INTO [Music] (
        [Music].[Music_id],
        [Music].[Music_title],
        [Music].[Music_file],
        [Music].[Music_thumbnail],
        [Music].[Music_date],
        [Music].[Music_type])
    VALUES (
        @Music_id,
        @Music_title,
        @Music_file,
        @Music_thumbnail,
        @Music_date,
        @Music_type)
    SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
    IF(@error != 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RETURN
    END
    SELECT DISTINCT [Music].[_rowVersion] 
        FROM [Music]
        WHERE ([Music].[Music_id] = @Music_id)
END
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Music_SavePlaylistmusics]
(
 @Playlist_id [uniqueidentifier],
 @Music_id [uniqueidentifier]
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
SELECT DISTINCT TOP 1 [Playlist_musics_Music].[Playlist_id] 
    FROM [Playlist_musics_Music]
    WHERE (([Playlist_musics_Music].[Music_id] = @Music_id) AND ([Playlist_musics_Music].[Playlist_id] = @Playlist_id))
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
IF(@error != 0)
BEGIN
    IF @tran = 1 ROLLBACK TRANSACTION
    RETURN
END
IF(@rowcount = 0)
BEGIN
    INSERT INTO [Playlist_musics_Music] (
        [Playlist_musics_Music].[Playlist_id],
        [Playlist_musics_Music].[Music_id])
    VALUES (
        @Playlist_id,
        @Music_id)
    SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
    IF(@error != 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RETURN
    END
END
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Playlist_Delete]
(
 @Playlist_id [uniqueidentifier],
 @_rowVersion [rowversion]
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
DELETE FROM [Playlist_musics_Music]
    WHERE ([Playlist_musics_Music].[Playlist_id] = @Playlist_id)
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
DELETE FROM [Playlist]
    WHERE (([Playlist].[Playlist_id] = @Playlist_id) AND ([Playlist].[_rowVersion] = @_rowVersion))
SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
IF(@rowcount = 0)
BEGIN
    IF @tran = 1 ROLLBACK TRANSACTION
    RAISERROR (50001, 16, 1, 'Playlist_Delete')
    RETURN
END
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Playlist_Save]
(
 @Playlist_id [uniqueidentifier],
 @Playlist_date [datetime] = NULL,
 @Playlist_title [nvarchar] (256) = NULL,
 @_rowVersion [rowversion] = NULL
)
AS
SET NOCOUNT ON
DECLARE @error int, @rowcount int
DECLARE @tran bit; SELECT @tran = 0
IF @@TRANCOUNT = 0
BEGIN
 SELECT @tran = 1
 BEGIN TRANSACTION
END
IF(@_rowVersion IS NOT NULL)
BEGIN
    UPDATE [Playlist] SET
     [Playlist].[Playlist_date] = @Playlist_date,
     [Playlist].[Playlist_title] = @Playlist_title
        WHERE (([Playlist].[Playlist_id] = @Playlist_id) AND ([Playlist].[_rowVersion] = @_rowVersion))
    SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
    IF(@error != 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RETURN
    END
    IF(@rowcount = 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RAISERROR (50001, 16, 1, 'Playlist_Save')
        RETURN
    END
    SELECT DISTINCT [Playlist].[_rowVersion] 
        FROM [Playlist]
        WHERE ([Playlist].[Playlist_id] = @Playlist_id)
END
ELSE
BEGIN
    INSERT INTO [Playlist] (
        [Playlist].[Playlist_id],
        [Playlist].[Playlist_date],
        [Playlist].[Playlist_title])
    VALUES (
        @Playlist_id,
        @Playlist_date,
        @Playlist_title)
    SELECT @error = @@ERROR, @rowcount = @@ROWCOUNT
    IF(@error != 0)
    BEGIN
        IF @tran = 1 ROLLBACK TRANSACTION
        RETURN
    END
    SELECT DISTINCT [Playlist].[_rowVersion] 
        FROM [Playlist]
        WHERE ([Playlist].[Playlist_id] = @Playlist_id)
END
IF @tran = 1 COMMIT TRANSACTION

RETURN
GO

CREATE PROCEDURE [dbo].[Music_Load]
(
 @id [uniqueidentifier]
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]
    WHERE ([Music].[Music_id] = @id)

RETURN
GO

CREATE PROCEDURE [dbo].[Music_LoadAll]
(
 @_orderBy0 [nvarchar] (64) = NULL,
 @_orderByDirection0 [bit] = 0
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]

RETURN
GO

CREATE PROCEDURE [dbo].[Music_LoadByid]
(
 @id [uniqueidentifier]
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]
    WHERE ([Music].[Music_id] = @id)

RETURN
GO

CREATE PROCEDURE [dbo].[Music_LoadmusicsByPlaylist]
(
 @Playlistid [uniqueidentifier],
 @_orderBy0 [nvarchar] (64) = NULL,
 @_orderByDirection0 [bit] = 0
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]
        LEFT OUTER JOIN [Playlist_musics_Music] ON ([Music].[Music_id] = [Playlist_musics_Music].[Music_id])
                LEFT OUTER JOIN [Playlist] ON ([Playlist_musics_Music].[Playlist_id] = [Playlist].[Playlist_id])
    WHERE ([Playlist_musics_Music].[Playlist_id] = @Playlistid)

RETURN
GO

CREATE PROCEDURE [dbo].[Music_SearchAll]
(
 @s [nvarchar] (256),
 @_orderBy0 [nvarchar] (64) = NULL,
 @_orderByDirection0 [bit] = 0
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Music].[Music_id], [Music].[Music_title], [Music].[Music_file], [Music].[Music_thumbnail], [Music].[Music_date], [Music].[Music_type], [Music].[_rowVersion] 
    FROM [Music]
    WHERE ([Music].[Music_title] LIKE '%'+@s+'%')

RETURN
GO

CREATE PROCEDURE [dbo].[Playlist_Load]
(
 @id [uniqueidentifier]
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Playlist].[Playlist_id], [Playlist].[Playlist_date], [Playlist].[Playlist_title], [Playlist].[_rowVersion] 
    FROM [Playlist]
    WHERE ([Playlist].[Playlist_id] = @id)

RETURN
GO

CREATE PROCEDURE [dbo].[Playlist_LoadAll]
(
 @_orderBy0 [nvarchar] (64) = NULL,
 @_orderByDirection0 [bit] = 0
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Playlist].[Playlist_id], [Playlist].[Playlist_date], [Playlist].[Playlist_title], [Playlist].[_rowVersion] 
    FROM [Playlist]

RETURN
GO

CREATE PROCEDURE [dbo].[Playlist_LoadByid]
(
 @id [uniqueidentifier]
)
AS
SET NOCOUNT ON
SELECT DISTINCT [Playlist].[Playlist_id], [Playlist].[Playlist_date], [Playlist].[Playlist_title], [Playlist].[_rowVersion] 
    FROM [Playlist]
    WHERE ([Playlist].[Playlist_id] = @id)

RETURN
GO

